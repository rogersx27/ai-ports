import type { IAiEvaluator } from "../ports/IAiEvaluator.ts";
import { AiUnavailableError } from "../errors.ts";

/** Evaluador para cuando no hay modelo de evaluación configurado: siempre lanza `AiUnavailableError`. */
export class NullAiEvaluator implements IAiEvaluator {
  readonly modelId = "none";

  async evaluateBooleans(): Promise<Record<string, number>> {
    throw new AiUnavailableError("No hay un modelo de evaluación configurado.");
  }
}
