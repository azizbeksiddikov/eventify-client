"use client";

import { TriangleAlert } from "lucide-react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/libs/components/ui/button";
import { logError } from "@/libs/logger";

/** Shown when a page throws while rendering. The header and footer stay; `reset` retries the page. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const { t } = useTranslation("errors");

	useEffect(() => {
		logError("Page crashed", error, { digest: error.digest });
	}, [error]);

	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
			<div className="mb-6 rounded-full bg-muted/50 p-8 ring-8 ring-muted/20">
				<TriangleAlert className="h-16 w-16 text-muted-foreground/50" />
			</div>
			<h1 className="mb-3 text-3xl font-bold text-foreground">{t("error_page_title")}</h1>
			<p className="mb-8 max-w-md leading-relaxed text-muted-foreground">{t("error_page_message")}</p>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button className="h-11 px-6" onClick={reset}>
					{t("try_again")}
				</Button>
				<Button asChild variant="outline" className="h-11 px-6">
					<Link href="/">{t("go_home")}</Link>
				</Button>
			</div>
		</div>
	);
}
