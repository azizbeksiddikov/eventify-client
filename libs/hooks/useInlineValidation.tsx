"use client";

import { useState } from "react";
import { smoothBehavior } from "@/libs/motion";

/**
 * Inline form validation shared by every form.
 *
 * Pass the current errors (computed from the form state on every render, `undefined` = valid)
 * and the field order. A field shows its error after it was left (blur) or after a failed
 * submit. The submit button stays enabled; `validate()` marks everything as touched, moves
 * focus to the first problem and returns false. What the user typed is never cleared.
 *
 * A field's input (or its wrapper with tabIndex -1) must have `id={name}`.
 */
export function useInlineValidation(errors: Record<string, string | undefined>, order: string[]) {
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const touch = (name: string) => setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
	const fieldError = (name: string) => (touched[name] ? errors[name] : undefined);

	/** Spread onto the input: aria wiring plus validate-on-leave. */
	const errorProps = (name: string) => ({
		"aria-invalid": fieldError(name) ? (true as const) : undefined,
		"aria-describedby": fieldError(name) ? `${name}-error` : undefined,
		onBlur: () => touch(name),
	});

	/** The message under the field (nothing when the field is fine). */
	const errorText = (name: string) =>
		fieldError(name) ? (
			<p id={`${name}-error`} role="alert" className="text-sm text-destructive">
				{fieldError(name)}
			</p>
		) : null;

	/** Call on submit. Returns true when the form is valid. */
	const validate = () => {
		setTouched(Object.fromEntries(order.map((name) => [name, true])));
		const firstInvalid = order.find((name) => errors[name]);
		if (!firstInvalid) return true;
		const el = document.getElementById(firstInvalid);
		el?.scrollIntoView({ block: "center", behavior: smoothBehavior() });
		el?.focus({ preventScroll: true });
		return false;
	};

	return { fieldError, errorProps, errorText, validate, touch, touched };
}

export type InlineValidation = ReturnType<typeof useInlineValidation>;
