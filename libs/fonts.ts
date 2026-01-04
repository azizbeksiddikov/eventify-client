type FontVariable = {
	variable: string;
};

const createFontVariable = (className: string): FontVariable => ({
	variable: className,
});

export const fontSans = createFontVariable("font-sans-variable");
export const fontMono = createFontVariable("font-mono-variable");
export const fontSerif = createFontVariable("font-serif-variable");

// CJK fonts for Korean
export const fontCJK_KR = createFontVariable("font-cjk-kr-variable");

// Cyrillic fonts for Russian
export const fontCyrillic = createFontVariable("font-cyrillic-variable");

export const fontCJK = {
	kr: fontCJK_KR,
};

/**
 * Get the appropriate font classes based on locale
 * @param locale - The current locale (en, ko, ru, uz)
 * @returns Array of font class names to apply
 */
export const getFontClasses = (locale: string): string[] => {
	const classes: string[] = [];

	// Korean - use CJK font
	if (locale === "ko") {
		classes.push("font-cjk");
		classes.push(fontCJK.kr.variable);
	}
	// Russian - use Cyrillic font
	else if (locale === "ru") {
		classes.push("font-cyrillic");
		classes.push(fontCyrillic.variable);
	}
	// English and Uzbek - use standard sans font
	else {
		classes.push("font-sans");
		classes.push(fontSans.variable);
	}

	// Always include serif and mono as fallbacks
	classes.push(fontSerif.variable);
	classes.push(fontMono.variable);

	return classes;
};
