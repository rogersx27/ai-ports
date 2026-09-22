import { NullAiAssistant } from "./adapters/NullAiAssistant.js";
const PROVIDERS = ["gemini", "anthropic", "openai", "gateway"];
const API_KEY = {
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
export function resolveAiProvider(env = process.env) {
    const explicit = env.AI_PROVIDER?.toLowerCase();
    const known = PROVIDERS.find((provider) => provider === explicit);
    if (known)
        return known;
    return PROVIDERS.find((provider) => env[API_KEY[provider]]) ?? null;
}
/**
 * Crea el asistente de texto según el entorno, o `NullAiAssistant` si no hay
 * proveedor. Los SDKs se importan bajo demanda: solo hace falta instalar el del
 * proveedor elegido.
 */
export async function createAiAssistant(env = process.env) {
    const provider = resolveAiProvider(env);
    switch (provider) {
        case "gemini": {
            const { GeminiAiAssistant } = await import("./adapters/GeminiAiAssistant.js");
            return new GeminiAiAssistant({ apiKey: env.GEMINI_API_KEY ?? "", model: env.GEMINI_MODEL });
        }
        case "anthropic": {
            const { AnthropicAiAssistant } = await import("./adapters/AnthropicAiAssistant.js");
            return new AnthropicAiAssistant({ apiKey: env.ANTHROPIC_API_KEY ?? "", model: env.ANTHROPIC_MODEL });
        }
        case "openai": {
            const { OpenAiAssistant } = await import("./adapters/OpenAiAssistant.js");
            return new OpenAiAssistant({ apiKey: env.OPENAI_API_KEY ?? "", model: env.OPENAI_MODEL });
        }
        case "gateway": {
            const { GatewayAiAssistant } = await import("./adapters/gateway.js");
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
export async function createAiEvaluator(env = process.env) {
    if (!env.AI_GATEWAY_API_KEY)
        return undefined;
    const { GatewayAiEvaluator } = await import("./adapters/gateway.js");
    return new GatewayAiEvaluator({ apiKey: env.AI_GATEWAY_API_KEY, model: env.AI_GATEWAY_EVALUATION_MODEL });
}
