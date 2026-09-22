import type { IAiAssistant } from "./ports/IAiAssistant.ts";
import type { IAiEvaluator } from "./ports/IAiEvaluator.ts";
import { NullAiAssistant } from "./adapters/NullAiAssistant.ts";

export type AiProvider = "gemini" | "anthropic" | "openai" | "gateway";

/** Variables de entorno que leen las fábricas (por defecto, `process.env`). */
export interface AiEnv {
  // Sin firma de índice, un entorno con otras variables tipadas (ej. `NODE_ENV` en
  // Next.js) no se puede asignar: TypeScript lo trata como un "weak type".
  [name: string]: string | undefined;
  AI_PROVIDER?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  ANTHROPIC_API_KEY?: string;
  ANTHROPIC_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  AI_GATEWAY_API_KEY?: string;
  AI_GATEWAY_MODEL?: string;
  AI_GATEWAY_EVALUATION_MODEL?: string;
}

const PROVIDERS: readonly AiProvider[] = ["gemini", "anthropic", "openai", "gateway"];

const API_KEY: Record<AiProvider, keyof AiEnv> = {
  gemini: "GEMINI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  gateway: "AI_GATEWAY_API_KEY",
};

/**
 * Qué proveedor de texto usar: `AI_PROVIDER` si es uno conocido; si no, el primero
 * con clave en este orden: Gemini, Anthropic, OpenAI, Vercel AI Gateway. `null` si
 * no hay ninguno.
 */
export function resolveAiProvider(env: AiEnv = process.env): AiProvider | null {
  const explicit = env.AI_PROVIDER?.toLowerCase();
  const known = PROVIDERS.find((provider) => provider === explicit);
  if (known) return known;
  return PROVIDERS.find((provider) => env[API_KEY[provider]]) ?? null;
}

/**
 * Crea el asistente de texto según el entorno, o `NullAiAssistant` si no hay
 * proveedor. Los SDKs se importan bajo demanda: solo hace falta instalar el del
 * proveedor elegido.
 */
export async function createAiAssistant(env: AiEnv = process.env): Promise<IAiAssistant> {
  const provider = resolveAiProvider(env);
  switch (provider) {
    case "gemini": {
      const { GeminiAiAssistant } = await import("./adapters/GeminiAiAssistant.ts");
      return new GeminiAiAssistant({ apiKey: env.GEMINI_API_KEY ?? "", model: env.GEMINI_MODEL });
    }
    case "anthropic": {
      const { AnthropicAiAssistant } = await import("./adapters/AnthropicAiAssistant.ts");
      return new AnthropicAiAssistant({ apiKey: env.ANTHROPIC_API_KEY ?? "", model: env.ANTHROPIC_MODEL });
    }
    case "openai": {
      const { OpenAiAssistant } = await import("./adapters/OpenAiAssistant.ts");
      return new OpenAiAssistant({ apiKey: env.OPENAI_API_KEY ?? "", model: env.OPENAI_MODEL });
    }
    case "gateway": {
      const { GatewayAiAssistant } = await import("./adapters/gateway.ts");
      return new GatewayAiAssistant({ apiKey: env.AI_GATEWAY_API_KEY ?? "", model: env.AI_GATEWAY_MODEL });
    }
    default:
      return new NullAiAssistant();
  }
}

/**
 * Crea el evaluador (Jev por defecto) si hay `AI_GATEWAY_API_KEY`, independiente de
 * `AI_PROVIDER`; `undefined` si no. Devolver `undefined` en vez de un evaluador nulo
 * permite que quien lo usa caiga a su camino sin evaluador (ej. hacerlo con texto).
 */
export async function createAiEvaluator(env: AiEnv = process.env): Promise<IAiEvaluator | undefined> {
  if (!env.AI_GATEWAY_API_KEY) return undefined;
  const { GatewayAiEvaluator } = await import("./adapters/gateway.ts");
  return new GatewayAiEvaluator({ apiKey: env.AI_GATEWAY_API_KEY, model: env.AI_GATEWAY_EVALUATION_MODEL });
}
