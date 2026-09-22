import type { AiCompletionOptions, IAiAssistant } from "../ports/IAiAssistant.ts";
import { type AdapterOptions } from "./options.ts";
export declare const GEMINI_DEFAULT_MODEL = "gemini-flash-latest";
export declare class GeminiAiAssistant implements IAiAssistant {
    private readonly client;
    private readonly model;
    constructor(options: AdapterOptions);
    complete(prompt: string, options?: AiCompletionOptions): Promise<string>;
}
