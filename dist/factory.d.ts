import type { IAiAssistant } from "./ports/IAiAssistant.ts";
import type { IAiEvaluator } from "./ports/IAiEvaluator.ts";
export type AiProvider = "gemini" | "anthropic" | "openai" | "gateway";
/** Variables de entorno que leen las fábricas (por defecto, `process.env`). */
export interface AiEnv {
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
/**
 * Qué proveedor de texto usar: `AI_PROVIDER` si es uno conocido; si no, el primero
 * con clave en este orden: Gemini, Anthropic, OpenAI, Vercel AI Gateway. `null` si
 * no hay ninguno.
 */
export declare function resolveAiProvider(env?: AiEnv): AiProvider | null;
/**
 * Crea el asistente de texto según el entorno, o `NullAiAssistant` si no hay
 * proveedor. Los SDKs se importan bajo demanda: solo hace falta instalar el del
 * proveedor elegido.
 */
export declare function createAiAssistant(env?: AiEnv): Promise<IAiAssistant>;
/**
 * Crea el evaluador (Jev por defecto) si hay `AI_GATEWAY_API_KEY`, independiente de
 * `AI_PROVIDER`; `undefined` si no. Devolver `undefined` en vez de un evaluador nulo
 * permite que quien lo usa caiga a su camino sin evaluador (ej. hacerlo con texto).
 */
export declare function createAiEvaluator(env?: AiEnv): Promise<IAiEvaluator | undefined>;
