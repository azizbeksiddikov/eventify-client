import { useEffect, useRef, useState } from "react";

/**
 * Keeps a text box responsive while only committing the value (e.g. to the URL and
 * the API) after the user pauses typing. `urlValue` is the committed value: when it
 * changes from outside (clear button, back/forward) the text box follows it.
 */
export function useDebouncedText(urlValue: string, commit: (value: string) => void, delay = 350) {
	const [text, setText] = useState(urlValue);
	const [committed, setCommitted] = useState(urlValue);
	const [prevUrlValue, setPrevUrlValue] = useState(urlValue);
	const commitRef = useRef(commit);

	useEffect(() => {
		commitRef.current = commit;
	});

	// The committed value changed outside this hook (not by our own commit): follow it.
	if (urlValue !== prevUrlValue) {
		setPrevUrlValue(urlValue);
		if (urlValue !== committed) {
			setCommitted(urlValue);
			setText(urlValue);
		}
	}

	useEffect(() => {
		if (text === committed) return;
		const id = setTimeout(() => {
			setCommitted(text);
			commitRef.current(text);
		}, delay);
		return () => clearTimeout(id);
	}, [text, committed, delay]);

	return [text, setText] as const;
}
