import i18n from "i18next";

/**
 * Turns whatever a failed request threw into a sentence a person can act on:
 * what went wrong and what to do next, in the visitor's language.
 *
 * Errors are identified by CODE, never by their English text:
 * - The backend sends a code with every error (`extensions.code`, for example `EVENT_FULL`)
 *   and optional `params`. The code is the key of the text in `public/locales/<lng>/errors.json`.
 * - Errors created in this app use `AppError` with the same kind of code.
 * - A code with no text, or an error without a code, shows `UNKNOWN_ERROR`. No English text from
 *   the backend ever reaches a visitor.
 *
 * Only failures that have no code of their own (the browser's "Failed to fetch") are matched by text.
 */
type Params = Record<string, string | number>;
type Translate = (key: string, params?: Params) => string;

/** An error made in the client with a code that has a text in `errors.json`. */
export class AppError extends Error {
	code: string;
	params?: Params;

	constructor(code: string, params?: Params) {
		super(code);
		this.name = "AppError";
		this.code = code;
		this.params = params;
	}
}

// Failures that carry no code: [pattern on the message, code in errors.json]
const RULES: Array<[RegExp, string]> = [
	[/failed to fetch|networkerror|network request|network connection|load failed|econn/i, "NETWORK_ERROR"],
];

type GraphQLLikeError = { message?: string; code?: string; params?: Params; extensions?: Record<string, unknown> };
type ErrorShape = GraphQLLikeError & { graphQLErrors?: GraphQLLikeError[]; errors?: GraphQLLikeError[] };

function firstError(error: unknown): GraphQLLikeError | undefined {
	const e = error as ErrorShape | null | undefined;
	return e?.graphQLErrors?.[0] ?? e?.errors?.[0] ?? e ?? undefined;
}

export function getRawErrorMessage(error: unknown): string {
	const e = error as ErrorShape | null | undefined;
	return (
		e?.graphQLErrors?.[0]?.message ||
		e?.errors?.[0]?.message ||
		e?.message ||
		(typeof error === "string" ? error : "") ||
		""
	);
}

/** The code of an error: from the API (`extensions.code`), from an `AppError`, or undefined. */
export function getErrorCode(error: unknown): string | undefined {
	const first = firstError(error);
	const code = (first?.extensions?.code as string | undefined) ?? first?.code;
	return typeof code === "string" && code ? code : undefined;
}

/** Values the translation can use, for example `{{currency}}`. */
export function getErrorParams(error: unknown): Params | undefined {
	const first = firstError(error);
	return (first?.extensions?.params as Params | undefined) ?? first?.params;
}

export function friendlyErrorMessage(error: unknown, options: { translate?: Translate } = {}): string {
	const translate: Translate = options.translate ?? ((key, params) => i18n.t(`errors:${key}`, params));
	const known = (code: string, params?: Params) => {
		const text = translate(code, params);
		return text && text !== code && text !== `errors:${code}` ? text : undefined;
	};

	const code = getErrorCode(error);
	if (code) {
		const text = known(code, getErrorParams(error));
		if (text) return text;
	}

	const raw = getRawErrorMessage(error).trim();
	for (const [pattern, ruleCode] of RULES) {
		if (pattern.test(raw)) return known(ruleCode) ?? translate("UNKNOWN_ERROR");
	}
	return translate("UNKNOWN_ERROR");
}

/**
 * Keeps the code of an error that is passed on (for example from the login request),
 * so the screen can still translate it. Errors without a code are returned as they are.
 */
export function toAppError(error: unknown, fallbackCode: string): Error {
	const code = getErrorCode(error);
	if (code) return new AppError(code, getErrorParams(error));
	return error instanceof Error ? error : new AppError(fallbackCode);
}
