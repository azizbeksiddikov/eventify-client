"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";

import { Button } from "@/libs/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";

export function ModeToggle() {
	const { t } = useTranslation("header");
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">{t("toggle_theme")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>{t("theme_light")}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>{t("theme_dark")}</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>{t("theme_system")}</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
