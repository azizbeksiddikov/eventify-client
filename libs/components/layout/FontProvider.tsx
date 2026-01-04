"use client";

import { useI18n } from "@/libs/i18n";
import { getFontClasses } from "@/libs/fonts";
import { useEffect } from "react";

/**
 * Client component that applies language-specific font classes to the document
 */
export function FontProvider({ children }: { children: React.ReactNode }) {
	const { locale } = useI18n();

	useEffect(() => {
		// Get font classes based on current locale
		const fontClasses = getFontClasses(locale);

		// Apply classes to html element
		const htmlElement = document.documentElement;

		// Remove existing font classes
		htmlElement.classList.remove(
			"font-sans",
			"font-cjk",
			"font-cyrillic",
			"font-sans-variable",
			"font-cjk-kr-variable",
			"font-cyrillic-variable",
			"font-serif-variable",
			"font-mono-variable",
		);

		// Add new font classes
		fontClasses.forEach((className) => {
			htmlElement.classList.add(className);
		});
	}, [locale]);

	return <>{children}</>;
}
