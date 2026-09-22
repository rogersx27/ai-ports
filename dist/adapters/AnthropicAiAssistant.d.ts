import type { AiCompletionOptions, IAiAssistant } from "../ports/IAiAssistant.ts";
import { type AdapterOptions } from "./options.ts";
export declare const ANTHROPIC_DEFAULT_MODEL = "claude-haiku-4-5-20251001";
export declare class AnthropicAiAssistant implements IAiAssistant {
    private readonly client;
    private readonly model;
    constructor(options: AdapterOptions);
    complete(prompt: string, options?: AiCompletionOptions): Promise<string>;
}
