import OpenAI from "openai";
import type { AiCompletionOptions, IAiAssistant } from "../ports/IAiAssistant.ts";
import { requireApiKey, type AdapterOptions } from "./options.ts";

export const OPENAI_DEFAULT_MODEL = "gpt-5-mini";

export class OpenAiAssistant implements IAiAssistant {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(options: AdapterOptions) {
    this.client = new OpenAI({ apiKey: requireApiKey(options.apiKey, "OpenAI") });
    this.model = options.model || OPENAI_DEFAULT_MODEL;
  }

  async complete(prompt: string, options?: AiCompletionOptions): Promise<string> {
    const response = await this.client.responses.create({
      model: this.model,
      input: prompt,
      temperature: options?.temperature,
      max_output_tokens: options?.maxOutputTokens,
      // Pensado para reescritura/clasificación de texto, que no requiere razonamiento
      // profundo -- "low" evita que los modelos de razonamiento gasten la mayoría del
      // presupuesto de tokens (y del tiempo) en tokens de razonamiento ocultos.
      reasoning: { effort: "low" },
    });
    return response.output_text ?? "";
  }
}
