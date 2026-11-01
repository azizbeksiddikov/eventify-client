// Run: node --test --experimental-strip-types tests/errorMessages.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import {
	AppError,
	friendlyErrorMessage,
	getErrorCode,
	getErrorParams,
	getRawErrorMessage,
	toAppError,
} from "../libs/errorMessages.ts";

// Fake translator: known codes return T(code), unknown codes return the key itself (like i18next).
const KNOWN = new Set([
	"EVENT_FULL",
	"WRONG_PASSWORD",
	"NOT_AUTHENTICATED",
	"CURRENCY_ALREADY_EXISTS",
	"NETWORK_ERROR",
	"UNKNOWN_ERROR",
]);
const translate = (key: string, params?: Record<string, string | number>) =>
	KNOWN.has(key) ? `T(${key}${params ? JSON.stringify(params) : ""})` : key;
const opts = { translate };

// What Apollo Client 4 throws for a GraphQL error the API formatted with a code.
const apolloError = (code: string, message = "English text", params?: Record<string, string | number>) => ({
	message,
	errors: [{ message, code, extensions: params ? { code, params } : { code } }],
});

test("translates by the code the API sends, whatever the English text says", () => {
	assert.equal(
		friendlyErrorMessage(apolloError("EVENT_FULL", "Reworded text nobody planned for"), opts),
		"T(EVENT_FULL)",
	);
	assert.equal(friendlyErrorMessage(apolloError("WRONG_PASSWORD"), opts), "T(WRONG_PASSWORD)");
});

test("reads the code from extensions, from a top-level code, and from graphQLErrors", () => {
	assert.equal(getErrorCode({ errors: [{ message: "m", extensions: { code: "A" } }] }), "A");
	assert.equal(getErrorCode({ errors: [{ message: "m", code: "B" }] }), "B");
	assert.equal(getErrorCode({ graphQLErrors: [{ message: "m", extensions: { code: "C" } }] }), "C");
	assert.equal(getErrorCode(new AppError("D")), "D");
	assert.equal(getErrorCode(new Error("plain")), undefined);
	assert.equal(getErrorCode(null), undefined);
});

test("passes params to the translation", () => {
	const err = apolloError("CURRENCY_ALREADY_EXISTS", "Currency USD already exists.", { currency: "USD" });
	assert.deepEqual(getErrorParams(err), { currency: "USD" });
	assert.equal(friendlyErrorMessage(err, opts), 'T(CURRENCY_ALREADY_EXISTS{"currency":"USD"})');
});

test("a code with no text, or no code at all, shows the generic line and never raw English", () => {
	assert.equal(
		friendlyErrorMessage(apolloError("SOMETHING_NEW", "Brand new backend sentence."), opts),
		"T(UNKNOWN_ERROR)",
	);
	assert.equal(friendlyErrorMessage(new Error("A plain English sentence."), opts), "T(UNKNOWN_ERROR)");
	assert.equal(
		friendlyErrorMessage(new Error("Cannot read properties of undefined (reading 'x')"), opts),
		"T(UNKNOWN_ERROR)",
	);
	assert.equal(friendlyErrorMessage(null, opts), "T(UNKNOWN_ERROR)");
	assert.equal(friendlyErrorMessage("some string", opts), "T(UNKNOWN_ERROR)");
});

test("errors made in the client carry their own code", () => {
	assert.equal(friendlyErrorMessage(new AppError("NOT_AUTHENTICATED"), opts), "T(NOT_AUTHENTICATED)");
	const withParams = new AppError("CURRENCY_ALREADY_EXISTS", { currency: "EUR" });
	assert.equal(friendlyErrorMessage(withParams, opts), 'T(CURRENCY_ALREADY_EXISTS{"currency":"EUR"})');
});

test("toAppError keeps the API code when an error is passed on", () => {
	const kept = toAppError(apolloError("WRONG_PASSWORD"), "LOGIN_FAILED");
	assert.ok(kept instanceof AppError);
	assert.equal(getErrorCode(kept), "WRONG_PASSWORD");
	const plain = new Error("boom");
	assert.equal(toAppError(plain, "LOGIN_FAILED"), plain);
	assert.equal(getErrorCode(toAppError("text", "LOGIN_FAILED")), "LOGIN_FAILED");
});

test("network failures have no code and are recognised by the browser's message", () => {
	assert.equal(friendlyErrorMessage(new TypeError("Failed to fetch"), opts), "T(NETWORK_ERROR)");
	assert.equal(friendlyErrorMessage(new Error("Load failed"), opts), "T(NETWORK_ERROR)");
});

test("reads the raw message from Apollo style errors", () => {
	assert.equal(getRawErrorMessage({ graphQLErrors: [{ message: "A" }], message: "B" }), "A");
	assert.equal(getRawErrorMessage({ errors: [{ message: "C" }] }), "C");
	assert.equal(getRawErrorMessage(new Error("D")), "D");
});
