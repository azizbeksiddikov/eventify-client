"use client";

import { cn } from "@/libs/utils";
import { useTranslation } from "next-i18next";

interface ListSkeletonProps {
	count?: number;
	/** "card" has a 16:9 image on top (events, groups); "row" is a compact card (organizers). */
	variant?: "card" | "row";
	className?: string;
}

/** Grey placeholder cards shown while a list loads, so the page keeps its shape instead of a lone spinner. */
export function ListSkeleton({ count = 6, variant = "card", className }: ListSkeletonProps) {
	const { t } = useTranslation("header");
	return (
		<div
			role="status"
			aria-busy="true"
			aria-label={t("loading")}
			className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3", className)}
		>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="overflow-hidden rounded-xl border bg-card motion-safe:animate-pulse">
					{variant === "card" && <div className="aspect-video w-full bg-muted" />}
					<div className="space-y-3 p-4">
						{variant === "row" && (
							<div className="flex items-center gap-3">
								<div className="h-12 w-12 rounded-full bg-muted" />
								<div className="h-4 w-1/2 rounded bg-muted" />
							</div>
						)}
						<div className="h-4 w-3/4 rounded bg-muted" />
						<div className="h-3 w-1/2 rounded bg-muted" />
						<div className="h-3 w-2/3 rounded bg-muted" />
					</div>
				</div>
			))}
		</div>
	);
}
