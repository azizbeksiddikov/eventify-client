"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
];

const initI18n = async (locale: string) => {
	const resources: Resource = {};

	for (const ns of namespaces) {
		const translations = await loadTranslations(locale, ns);
		if (!resources[locale]) {
			resources[locale] = {};
		}
		resources[locale][ns] = translations;
	}

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

	useEffect(() => {
		// Initialize i18n with locale
		initI18n(locale).then(() => {
			setIsInitialized(true);
		});
	}, [locale]);

	const changeLocale = async (newLocale: string) => {
		localStorage.setItem("locale", newLocale);
		setLocale(newLocale);
	};

	if (!isInitialized) {
		return null; // or a loading spinner
	}

	return (
		<I18nContext.Provider value={{ locale, changeLocale }}>
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		</I18nContext.Provider>
	);
}
