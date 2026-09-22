import { AiUnavailableError } from "../errors.js";
/** Evaluador para cuando no hay modelo de evaluación configurado: siempre lanza `AiUnavailableError`. */
export class NullAiEvaluator {
    modelId = "none";
    async evaluateBooleans() {
        throw new AiUnavailableError("No hay un modelo de evaluación configurado.");
    }
}
