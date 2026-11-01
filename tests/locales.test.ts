// Run: node --test --experimental-strip-types tests/locales.test.ts
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const { check } = require("../scripts/check-locales.js") as { check: () => string[] };

test("every language has the same files and keys as English", () => {
	const problems = check();
	assert.deepEqual(problems, [], "\n" + problems.slice(0, 20).join("\n"));
});
