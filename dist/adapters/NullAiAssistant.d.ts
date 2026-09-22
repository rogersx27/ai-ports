import type { IAiAssistant } from "../ports/IAiAssistant.ts";
/** Asistente para cuando no hay proveedor configurado: siempre lanza `AiUnavailableError`. */
export declare class NullAiAssistant implements IAiAssistant {
    complete(): Promise<string>;
}
