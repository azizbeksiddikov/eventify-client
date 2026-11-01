import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "./button";

export function ModeToggle() {
	const { t } = useTranslation("header");
	const { setTheme, resolvedTheme } = useTheme();

	const toggleTheme = React.useCallback(() => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);

	return (
		<Button variant="ghost" className="group/toggle h-10 w-10 !px-0 text-foreground " onClick={toggleTheme}>
			<SunIcon className="hidden [html.dark_&]:block" />
			<MoonIcon className="hidden [html.light_&]:block" />
			<span className="sr-only">{t("toggle_theme")}</span>
		</Button>
	);
}
