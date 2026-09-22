import type { IAiEvaluator } from "../ports/IAiEvaluator.ts";
/** Evaluador para cuando no hay modelo de evaluación configurado: siempre lanza `AiUnavailableError`. */
export declare class NullAiEvaluator implements IAiEvaluator {
    readonly modelId = "none";
    evaluateBooleans(): Promise<Record<string, number>>;
}
