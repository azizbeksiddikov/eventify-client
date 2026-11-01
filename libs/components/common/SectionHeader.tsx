"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/libs/utils";

interface SectionHeaderProps {
	title: string;
	href: string;
	/** Text shown next to the arrow from the sm breakpoint up. Phones always get an icon-only button. */
	linkLabel?: string;
	/** Accessible name of the link (defaults to linkLabel, then title). */
	ariaLabel?: string;
	linkClassName?: string;
}

/**
 * Title row used by homepage sections: a compact heading that never wraps next to a
 * 40px "go to list" button (icon only on phones).
 */
export function SectionHeader({ title, href, linkLabel, ariaLabel, linkClassName }: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
			<h2 className="min-w-0 text-xl sm:text-2xl lg:text-3xl leading-tight text-foreground">{title}</h2>
			<Link
				href={href}
				aria-label={ariaLabel ?? linkLabel ?? title}
				className={cn(
					"inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90",
					"h-11 w-11 sm:w-auto sm:px-4 md:h-11 md:px-6",
					linkClassName,
				)}
			>
				{linkLabel && <span className="hidden sm:inline">{linkLabel}</span>}
				<ArrowRight className="h-4 w-4" />
			</Link>
		</div>
	);
}
