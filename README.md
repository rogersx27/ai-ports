# ai-ports

Capa de IA agnóstica de proveedor para proyectos TypeScript, extraída de [srs-wizard](https://github.com/rogersx27/srs-wizard):

- **Puertos:** `IAiAssistant` (texto), `IAiEvaluator` (evaluación) e `IAiCacheRepository` (caché). El dominio y la aplicación dependen solo de estas interfaces, nunca del SDK de un proveedor.
- **Adaptadores:** Gemini, Anthropic, OpenAI y Vercel AI Gateway para texto; [Jev](https://vercel.com/ai-gateway/models/jev) (vía Vercel AI Gateway) para evaluación.
- **Fábricas por entorno:** `createAiAssistant()` y `createAiEvaluator()` leen las mismas variables que srs-wizard e importan solo el SDK del proveedor elegido.
- **Utilidades:** `withTimeout`, `hashContent`, `withCache` y adaptadores nulos, para que la IA nunca bloquee un flujo.

## Instalación

El repositorio es privado y se instala como dependencia git (necesitas acceso a él):

```bash
pnpm add github:rogersx27/ai-ports#v0.1.0
```

El paquete se compila al instalarse (script `prepare`). pnpm bloquea por defecto los scripts de dependencias, así que hay que permitirlo en el `pnpm-workspace.yaml` del proyecto consumidor:

```yaml
allowBuilds:
  '@rogersx27/ai-ports': true
```

Los SDKs de los proveedores son *peer dependencies* opcionales. Instala solo los que uses:

| Proveedor | Paquete |
|---|---|
| Gemini | `@google/genai` |
| Anthropic | `@anthropic-ai/sdk` |
| OpenAI | `openai` |
| Vercel AI Gateway (texto y Jev) | `ai` (`^7.0.107`) |

Requiere Node 22 o superior.

## Uso

### Con variables de entorno

```ts
import { createAiAssistant, createAiEvaluator, withTimeout } from "@rogersx27/ai-ports";

const assistant = await createAiAssistant(); // lee process.env
const evaluator = await createAiEvaluator(); // undefined si no hay AI_GATEWAY_API_KEY

const summary = await withTimeout(assistant.complete("Resume este texto: ..."), 10_000);
```

| Variable | Uso |
|---|---|
| `AI_PROVIDER` | `"gemini"`, `"anthropic"`, `"openai"` o `"gateway"`. Sin definir (o con un valor desconocido), se usa el primero con clave en ese mismo orden |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Gemini (default `gemini-flash-latest`) |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` | Anthropic (default `claude-haiku-4-5-20251001`) |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | OpenAI (default `gpt-5-mini`) |
| `AI_GATEWAY_API_KEY` / `AI_GATEWAY_MODEL` | Vercel AI Gateway como proveedor de texto (default `anthropic/claude-haiku-4.5`) |
| `AI_GATEWAY_EVALUATION_MODEL` | Modelo de evaluación (default `typesafe-ai/jev`). El evaluador se activa con `AI_GATEWAY_API_KEY`, sin importar `AI_PROVIDER` |

Sin ninguna clave, `createAiAssistant()` devuelve `NullAiAssistant`, que lanza `AiUnavailableError`. Captúralo para degradar al comportamiento sin IA.

Las fábricas aceptan un objeto de entorno propio en vez de `process.env`: `createAiAssistant({ GEMINI_API_KEY: "..." })`.

### Con adaptadores concretos

Cada adaptador tiene su propio subpath, así que importarlo no carga los SDKs de los demás:

```ts
import { GatewayAiAssistant, GatewayAiEvaluator } from "@rogersx27/ai-ports/gateway";
import { AnthropicAiAssistant } from "@rogersx27/ai-ports/anthropic";

const evaluator = new GatewayAiEvaluator({ apiKey: process.env.AI_GATEWAY_API_KEY! }); // Jev
const assistant = new AnthropicAiAssistant({ apiKey: "...", model: "claude-haiku-4-5-20251001" });
```

Subpaths: `@rogersx27/ai-ports/gemini`, `/anthropic`, `/openai`, `/gateway`.

## Jev: evaluación en vez de texto

Jev no genera texto: recibe un **estado compartido** y **preguntas de sí/no**, y devuelve la probabilidad (0 a 1) de "sí" por pregunta. Todas las preguntas van en una sola llamada. Sirve para clasificar, verificar o puntuar, no para redactar:

```ts
const requirements = [
  { id: "RF-001", text: "El sistema debe ser rápido" },
  { id: "RF-002", text: "La búsqueda responde en menos de 2 s con 10.000 registros" },
];

const probabilities = await evaluator.evaluateBooleans(
  requirements,
  Object.fromEntries(
    requirements.map((r) => [r.id, { instructions: `¿El requisito ${r.id} usa cualidades subjetivas sin una métrica verificable?` }])
  )
);
// { "RF-001": 0.93, "RF-002": 0.04 }  (valores ilustrativos)

const vague = requirements.filter((r) => probabilities[r.id] >= 0.7);
```

- **Umbral:** no hay uno universal. Calíbralo con ejemplos etiquetados de tu propio flujo ([guía de Vercel](https://vercel.com/i/jev-probabilities-and-thresholds)).
- **Claves de las preguntas:** pueden ser cualquier string. El adaptador las envía como `q0`, `q1`, … y las vuelve a mapear, así que no importa qué caracteres acepte el proveedor.
- **`modelId`:** inclúyelo en el hash del caché. Así, un resultado calculado sin evaluador, o con otro modelo, no se sirve al activar Jev.

La explicación completa de cómo se usó en srs-wizard, con el reparto de chequeos entre Jev y un modelo de texto, la degradación y el caché, está en [srs-wizard/docs/ia-evaluacion-jev.md](https://github.com/rogersx27/srs-wizard/blob/develop/docs/ia-evaluacion-jev.md).

**Cuenta de Vercel:** el gateway exige una tarjeta registrada. Sin ella responde `401 customer_verification_required`, y el SDK lo reporta como `GatewayAuthenticationError` aunque la clave sea válida.

## Caché de resultados

`withCache` guarda el resultado de un cálculo de IA en tu propio almacén (Prisma, Redis, etc.) y solo lo recalcula cuando cambia el hash de su entrada. Un resultado degradado (`cacheable: false`) nunca se guarda, para que la siguiente llamada reintente:

```ts
import { withCache, hashContent, type IAiCacheRepository } from "@rogersx27/ai-ports";

const cache: IAiCacheRepository = {
  get: (scope, kind) => db.aiCache.findUnique({ where: { scope_kind: { scope, kind } } }),
  set: async (scope, kind, inputHash, payload) => { /* upsert */ },
};

const result = await withCache(cache, projectId, "summary", hashContent({ input, model: evaluator?.modelId }), async () => {
  try {
    return { value: await assistant.complete(prompt), cacheable: true };
  } catch {
    return { value: fallback, cacheable: false };
  }
});
```

## Desarrollo

```bash
pnpm install
pnpm test        # node --test sobre los .ts, sin transpilar
pnpm typecheck
pnpm build       # emite dist/
```

El código usa solo sintaxis TypeScript *erasable* (`erasableSyntaxOnly`): nada de `enum` ni *parameter properties*. Así `node --test` lo ejecuta directamente, y los imports relativos llevan extensión `.ts`, que `tsc` reescribe a `.js` al compilar.

## Licencia

[MIT](LICENSE)
