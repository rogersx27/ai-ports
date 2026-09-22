import assert from "node:assert/strict";
import { test } from "node:test";
import { withTimeout } from "../src/utils/withTimeout.ts";
import { hashContent } from "../src/utils/contentHash.ts";
import { AiUnavailableError, NullAiAssistant, NullAiEvaluator } from "../src/index.ts";

test("withTimeout resolves with the value when the promise finishes in time", async () => {
  assert.equal(await withTimeout(Promise.resolve("ok"), 50), "ok");
});

test("withTimeout rejects when the promise takes longer than the limit", async () => {
  const slow = new Promise((resolve) => setTimeout(resolve, 200, "late"));
  await assert.rejects(withTimeout(slow, 10), /AI request timed out/);
});

test("withTimeout propagates the original error", async () => {
  await assert.rejects(withTimeout(Promise.reject(new Error("boom")), 50), /boom/);
});

test("hashContent is stable for equal content and differs for different content", () => {
  assert.equal(hashContent([{ id: "RF-001", text: "a" }]), hashContent([{ id: "RF-001", text: "a" }]));
  assert.notEqual(hashContent([{ id: "RF-001", text: "a" }]), hashContent([{ id: "RF-001", text: "b" }]));
});

test("null adapters always throw AiUnavailableError", async () => {
  await assert.rejects(new NullAiAssistant().complete(), AiUnavailableError);
  await assert.rejects(new NullAiEvaluator().evaluateBooleans(), AiUnavailableError);
});
