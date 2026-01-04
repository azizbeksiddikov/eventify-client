"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import type { Resource } from "i18next";

// Import translation files
const loadTranslations = async (locale: string, namespace: string) => {
	try {
		const response = await fetch(`/locales/${locale}/${namespace}.json`);
		return await response.json();
	} catch (error) {
		console.error(`Failed to load translations for ${locale}/${namespace}`, error);
		return {};
	}
};

const namespaces = [
	"header",
	"footer",
	"comments",
	"home",
	"events",
	"groups",
	"organizers",
	"auth",
	"profile",
	"help",
	"admin",
	"errors",
	"calendar",
];

// Cache for loaded translations to avoid re-fetching
const translationCache = new Map<string, Record<string, unknown>>();

const getCacheKey = (locale: string, namespace: string) => `${locale}:${namespace}`;

const loadAllTranslations = async (locale: string): Promise<Resource> => {
	const resources: Resource = {};

	// Check which translations need to be loaded
	const translationsToLoad: Promise<[string, Record<string, unknown>]>[] = [];

	for (const ns of namespaces) {
		const cacheKey = getCacheKey(locale, ns);
		const cached = translationCache.get(cacheKey);

		if (cached) {
			// Use cached translation
			if (!resources[locale]) {
				resources[locale] = {};
			}
			resources[locale][ns] = cached;
		} else {
			// Load translation and cache it
			translationsToLoad.push(
				loadTranslations(locale, ns).then((translations) => {
					translationCache.set(cacheKey, translations);
					return [ns, translations];
				}),
			);
		}
	}

	// Load all missing translations in parallel
	if (translationsToLoad.length > 0) {
		const loaded = await Promise.all(translationsToLoad);
		if (!resources[locale]) {
			resources[locale] = {};
		}
		loaded.forEach(([ns, translations]) => {
			resources[locale][ns] = translations;
		});
	}

	return resources;
};

const initI18n = async (locale: string) => {
	const resources = await loadAllTranslations(locale);

	if (!i18n.isInitialized) {
		await i18n.use(initReactI18next).init({
			resources,
			lng: locale,
			fallbackLng: "en",
			defaultNS: "header",
			ns: namespaces,
			interpolation: {
				escapeValue: false,
			},
		});
	} else {
		// Add resources and change language
		Object.keys(resources).forEach((lang) => {
			Object.keys(resources[lang]).forEach((ns) => {
				i18n.addResourceBundle(lang, ns, resources[lang][ns], true, true);
			});
		});
		await i18n.changeLanguage(locale);
	}
};

interface I18nContextType {
	locale: string;
	changeLocale: (newLocale: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within I18nProvider");
	}
	return context;
};

export function I18nProvider({ children }: { children: ReactNode }) {
	const [isInitialized, setIsInitialized] = useState(false);
	const [locale, setLocale] = useState<string>(() => {
		// Initialize from localStorage only on client-side
		if (typeof window !== "undefined") {
			return localStorage.getItem("locale") || "en";
		}
		return "en";
	});
	const isChangingLanguage = useRef(false);

	// Initial load only
	useEffect(() => {
		if (!isInitialized) {
			initI18n(locale).then(() => {
				setIsInitialized(true);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Only run on mount - locale is captured from initial state

	// Handle language changes after initialization
	useEffect(() => {
		if (isInitialized && !isChangingLanguage.current) {
			isChangingLanguage.current = true;
			initI18n(locale).finally(() => {
				isChangingLanguage.current = false;
			});
		}
	}, [locale, isInitialized]);

	const changeLocale = async (newLocale: string) => {
		if (newLocale === locale) return;
		localStorage.setItem("locale", newLocale);
		setLocale(newLocale);
	};

	// Only show loading on initial mount, not on language changes
	if (!isInitialized) {
		return null; // or a loading spinner
	}

	return (
		<I18nContext.Provider value={{ locale, changeLocale }}>
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		</I18nContext.Provider>
	);
}
