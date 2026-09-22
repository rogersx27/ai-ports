import { GoogleGenAI } from "@google/genai";
import { requireApiKey } from "./options.js";
export const GEMINI_DEFAULT_MODEL = "gemini-flash-latest";
export class GeminiAiAssistant {
    client;
    model;
    constructor(options) {
        this.client = new GoogleGenAI({ apiKey: requireApiKey(options.apiKey, "Gemini") });
        this.model = options.model || GEMINI_DEFAULT_MODEL;
    }
    async complete(prompt, options) {
        const response = await this.client.models.generateContent({
            model: this.model,
            contents: prompt,
            config: {
                temperature: options?.temperature,
                maxOutputTokens: options?.maxOutputTokens,
            },
        });
        return response.text ?? "";
    }
}
