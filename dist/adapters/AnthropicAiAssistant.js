import Anthropic from "@anthropic-ai/sdk";
import { requireApiKey } from "./options.js";
export const ANTHROPIC_DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const DEFAULT_MAX_TOKENS = 1024;
export class AnthropicAiAssistant {
    client;
    model;
    constructor(options) {
        this.client = new Anthropic({ apiKey: requireApiKey(options.apiKey, "Anthropic") });
        this.model = options.model || ANTHROPIC_DEFAULT_MODEL;
    }
    async complete(prompt, options) {
        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: options?.maxOutputTokens ?? DEFAULT_MAX_TOKENS,
            temperature: options?.temperature,
            messages: [{ role: "user", content: prompt }],
        });
        const textBlock = response.content.find((block) => block.type === "text");
        return textBlock?.type === "text" ? textBlock.text : "";
    }
}
