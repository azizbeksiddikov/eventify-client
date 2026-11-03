"use client";

import { useTranslation } from "next-i18next";

import NotFound from "@/libs/components/common/NotFound";

/** Shown by Next.js for any URL that matches no page. */
export default function PageNotFound() {
	const { t } = useTranslation("errors");

	return (
		<NotFound
			title={t("page_not_found_title")}
			message={t("page_not_found_message")}
			backPath="/"
			backLabel={t("go_home")}
		/>
	);
}
