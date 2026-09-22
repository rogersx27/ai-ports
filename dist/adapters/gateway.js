import { createGateway, experimental_evaluate as evaluate, generateText } from "ai";
import { requireApiKey } from "./options.js";
export const GATEWAY_DEFAULT_MODEL = "anthropic/claude-haiku-4.5";
export const GATEWAY_DEFAULT_EVALUATION_MODEL = "typesafe-ai/jev";
/** Modelo de texto servido por Vercel AI Gateway. */
export class GatewayAiAssistant {
    gateway;
    model;
    constructor(options) {
        this.gateway = createGateway({ apiKey: requireApiKey(options.apiKey, "Vercel AI Gateway") });
        this.model = options.model || GATEWAY_DEFAULT_MODEL;
    }
    async complete(prompt, options) {
        const { text } = await generateText({
            model: this.gateway(this.model),
            prompt,
            temperature: options?.temperature,
            maxOutputTokens: options?.maxOutputTokens,
        });
        return text;
    }
}
/** Modelo de evaluación servido por Vercel AI Gateway (Jev por defecto). */
export class GatewayAiEvaluator {
    gateway;
    modelId;
    constructor(options) {
        this.gateway = createGateway({ apiKey: requireApiKey(options.apiKey, "Vercel AI Gateway") });
        this.modelId = options.model || GATEWAY_DEFAULT_EVALUATION_MODEL;
    }
    async evaluateBooleans(state, questions) {
        // Las claves de las preguntas se envían como q0, q1, ... para no depender de qué
        // caracteres acepta el proveedor en los IDs (ej. "RF-001").
        const keys = Object.keys(questions);
        const { answers } = await evaluate({
            model: this.gateway.evaluationModel(this.modelId),
            state,
            questions: Object.fromEntries(keys.map((key, index) => [`q${index}`, { type: "boolean", instructions: questions[key].instructions }])),
        });
        return Object.fromEntries(keys.map((key, index) => [key, answers[`q${index}`].probability]));
    }
}
