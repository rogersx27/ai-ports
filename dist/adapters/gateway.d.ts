import type { AiCompletionOptions, IAiAssistant } from "../ports/IAiAssistant.ts";
import type { AiEvaluationQuestion, AiEvaluationState, IAiEvaluator } from "../ports/IAiEvaluator.ts";
import { type AdapterOptions } from "./options.ts";
export declare const GATEWAY_DEFAULT_MODEL = "anthropic/claude-haiku-4.5";
export declare const GATEWAY_DEFAULT_EVALUATION_MODEL = "typesafe-ai/jev";
/** Modelo de texto servido por Vercel AI Gateway. */
export declare class GatewayAiAssistant implements IAiAssistant {
    private readonly gateway;
    private readonly model;
    constructor(options: AdapterOptions);
    complete(prompt: string, options?: AiCompletionOptions): Promise<string>;
}
/** Modelo de evaluación servido por Vercel AI Gateway (Jev por defecto). */
export declare class GatewayAiEvaluator implements IAiEvaluator {
    private readonly gateway;
    readonly modelId: string;
    constructor(options: AdapterOptions);
    evaluateBooleans(state: AiEvaluationState, questions: Record<string, AiEvaluationQuestion>): Promise<Record<string, number>>;
}
