import { AiUnavailableError } from "../errors.js";
/** Asistente para cuando no hay proveedor configurado: siempre lanza `AiUnavailableError`. */
export class NullAiAssistant {
    async complete() {
        throw new AiUnavailableError("No hay un proveedor de IA configurado.");
    }
}
