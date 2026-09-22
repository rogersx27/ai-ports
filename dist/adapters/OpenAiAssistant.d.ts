import type { AiCompletionOptions, IAiAssistant } from "../ports/IAiAssistant.ts";
import { type AdapterOptions } from "./options.ts";
export declare const OPENAI_DEFAULT_MODEL = "gpt-5-mini";
export declare class OpenAiAssistant implements IAiAssistant {
    private readonly client;
    private readonly model;
    constructor(options: AdapterOptions);
    complete(prompt: string, options?: AiCompletionOptions): Promise<string>;
}
