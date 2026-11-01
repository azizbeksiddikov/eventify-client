"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { cn } from "@/libs/utils";

interface FiltersToggleProps {
	label: string;
	open: boolean;
	count: number;
	onToggle: () => void;
	className?: string;
}

/** Phone-only "Filters" button that shows/hides the extra filter controls and counts the active ones. */
export function FiltersToggle({ label, open, count, onToggle, className }: FiltersToggleProps) {
	return (
		<Button
			type="button"
			variant="outline"
			onClick={onToggle}
			aria-expanded={open}
			aria-label={count ? `${label} (${count})` : label}
			className={cn("h-11 shrink-0 gap-2 px-3 sm:hidden", open && "border-primary text-primary", className)}
		>
			<SlidersHorizontal className="h-4 w-4" />
			<span>{label}</span>
			{count > 0 && (
				<span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
					{count}
				</span>
			)}
		</Button>
	);
}
