import type { IAiAssistant } from "../ports/IAiAssistant.ts";
import { AiUnavailableError } from "../errors.ts";

/** Asistente para cuando no hay proveedor configurado: siempre lanza `AiUnavailableError`. */
export class NullAiAssistant implements IAiAssistant {
  async complete(): Promise<string> {
    throw new AiUnavailableError("No hay un proveedor de IA configurado.");
  }
}
