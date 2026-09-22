import assert from "node:assert/strict";
import { test } from "node:test";
import { createAiAssistant, createAiEvaluator, resolveAiProvider, NullAiAssistant } from "../src/index.ts";
import { GeminiAiAssistant } from "../src/adapters/GeminiAiAssistant.ts";
import { AnthropicAiAssistant } from "../src/adapters/AnthropicAiAssistant.ts";
import { OpenAiAssistant } from "../src/adapters/OpenAiAssistant.ts";
import { GatewayAiAssistant, GatewayAiEvaluator, GATEWAY_DEFAULT_EVALUATION_MODEL } from "../src/adapters/gateway.ts";

test("resolveAiProvider prefers AI_PROVIDER when it names a known provider", () => {
  assert.equal(resolveAiProvider({ AI_PROVIDER: "Gateway", GEMINI_API_KEY: "k" }), "gateway");
});

test("resolveAiProvider falls back to Gemini, Anthropic, OpenAI, Gateway in that order", () => {
  assert.equal(resolveAiProvider({ OPENAI_API_KEY: "k", ANTHROPIC_API_KEY: "k" }), "anthropic");
  assert.equal(resolveAiProvider({ AI_GATEWAY_API_KEY: "k", OPENAI_API_KEY: "k" }), "openai");
  assert.equal(resolveAiProvider({ AI_GATEWAY_API_KEY: "k" }), "gateway");
  assert.equal(resolveAiProvider({ AI_PROVIDER: "desconocido", GEMINI_API_KEY: "k" }), "gemini");
  assert.equal(resolveAiProvider({}), null);
});

test("createAiAssistant builds the adapter of the resolved provider", async () => {
  assert.ok((await createAiAssistant({ GEMINI_API_KEY: "k" })) instanceof GeminiAiAssistant);
  assert.ok((await createAiAssistant({ ANTHROPIC_API_KEY: "k" })) instanceof AnthropicAiAssistant);
  assert.ok((await createAiAssistant({ OPENAI_API_KEY: "k" })) instanceof OpenAiAssistant);
  assert.ok((await createAiAssistant({ AI_GATEWAY_API_KEY: "k" })) instanceof GatewayAiAssistant);
  assert.ok((await createAiAssistant({})) instanceof NullAiAssistant);
});

test("createAiAssistant fails loudly when AI_PROVIDER is forced without its key", async () => {
  await assert.rejects(createAiAssistant({ AI_PROVIDER: "openai" }), /Falta la API key de OpenAI/);
});

test("createAiEvaluator returns Jev only when AI_GATEWAY_API_KEY is set, regardless of AI_PROVIDER", async () => {
  assert.equal(await createAiEvaluator({ GEMINI_API_KEY: "k" }), undefined);

  const evaluator = await createAiEvaluator({ AI_PROVIDER: "gemini", AI_GATEWAY_API_KEY: "k" });
  assert.ok(evaluator instanceof GatewayAiEvaluator);
  assert.equal(evaluator.modelId, GATEWAY_DEFAULT_EVALUATION_MODEL);

  const custom = await createAiEvaluator({ AI_GATEWAY_API_KEY: "k", AI_GATEWAY_EVALUATION_MODEL: "otro/modelo" });
  assert.equal(custom?.modelId, "otro/modelo");
});
