export interface AiCompletionOptions {
  temperature?: number;
  maxOutputTokens?: number;
}

/** Modelo de texto: recibe un prompt y devuelve la respuesta como texto. */
export interface IAiAssistant {
  complete(prompt: string, options?: AiCompletionOptions): Promise<string>;
}
