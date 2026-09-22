import { GoogleGenAI } from "@google/genai";
import type { AiCompletionOptions, IAiAssistant } from "../ports/IAiAssistant.ts";
import { requireApiKey, type AdapterOptions } from "./options.ts";

export const GEMINI_DEFAULT_MODEL = "gemini-flash-latest";

export class GeminiAiAssistant implements IAiAssistant {
  private readonly client: GoogleGenAI;
  private readonly model: string;

  constructor(options: AdapterOptions) {
    this.client = new GoogleGenAI({ apiKey: requireApiKey(options.apiKey, "Gemini") });
    this.model = options.model || GEMINI_DEFAULT_MODEL;
  }

  async complete(prompt: string, options?: AiCompletionOptions): Promise<string> {
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
