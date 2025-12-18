import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/libs/utils";
import type { Event } from "@/libs/types/event/event";

type HomeCalendarProps = {
	className?: string;
	events: Event[];
	selected?: Date;
	onSelect?: (date: Date) => void;
	startMonth?: Date;
	endMonth?: Date;
	disableBefore?: Date;
};

/**
 * Homepage-only calendar (Upcoming Events).
 * This is intentionally separated from the shared `libs/components/ui/calendar.tsx`
 * so we can fully customize the homepage calendar without impacting other pages.
 */
export function HomeCalendar({ className, events, ...props }: HomeCalendarProps) {
	const today = new Date();
	const selected = props.selected;
	const onSelect = props.onSelect;
	const minMonth = props.startMonth ? new Date(props.startMonth.getFullYear(), props.startMonth.getMonth(), 1) : null;
	const disabledBefore = props.disableBefore ?? null;

	const initialMonth = selected ?? today;
	const [viewMonth, setViewMonth] = React.useState<Date>(
		() => new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
	);

	const monthLabel = viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
	const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

	const startDayOfWeek = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
	const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

	const eventDaySet = React.useMemo(() => {
		const set = new Set<string>();
		for (const e of events) {
			const d = new Date(e.eventStartAt);
			set.add(new Date(d.getFullYear(), d.getMonth(), d.getDate()).toDateString());
		}
		return set;
	}, [events]);

	const isSameDay = (a: Date, b: Date) =>
		a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

	const isBeforeDay = (a: Date, b: Date) => {
		const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
		const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
		return da < db;
	};

	const canGoPrev =
		!minMonth || new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1).getTime() >= minMonth.getTime();
	const canGoNext = props.endMonth
		? new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1).getTime() <=
			new Date(props.endMonth.getFullYear(), props.endMonth.getMonth(), 1).getTime()
		: true;

	const goPrev = () => {
		if (!canGoPrev) return;
		setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
	};
	const goNext = () => {
		if (!canGoNext) return;
		setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
	};

	return (
		<div className={cn("w-full rounded-xl border border-border bg-background", className)}>
			{/* Header */}
			<div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-border">
				<button
					type="button"
					onClick={goPrev}
					disabled={!canGoPrev}
					aria-label="Previous month"
					className={cn(
						"h-9 w-9 rounded-lg border border-border bg-card/70 text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center",
					)}
				>
					<ChevronLeft className="h-4 w-4" />
				</button>

				<div className="text-sm sm:text-base font-semibold text-foreground select-none">{monthLabel}</div>

				<button
					type="button"
					onClick={goNext}
					disabled={!canGoNext}
					aria-label="Next month"
					className={cn(
						"h-9 w-9 rounded-lg border border-border bg-card/70 text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center",
					)}
				>
					<ChevronRight className="h-4 w-4" />
				</button>
			</div>

			{/* Grid */}
			<div className="p-3 sm:p-4">
				<div className="grid grid-cols-7 gap-1">
					{weekdays.map((d) => (
						<div key={d} className="text-[11px] sm:text-xs font-medium text-muted-foreground text-center py-1">
							{d}
						</div>
					))}

					{Array.from({ length: startDayOfWeek }).map((_, idx) => (
						<div key={`empty-${idx}`} />
					))}

					{Array.from({ length: daysInMonth }).map((_, i) => {
						const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1);
						const isSelected = !!selected && isSameDay(selected, date);
						const isDisabled = disabledBefore ? isBeforeDay(date, disabledBefore) : false;
						const hasEvent = eventDaySet.has(date.toDateString());

						return (
							<button
								key={date.toISOString()}
								type="button"
								disabled={isDisabled}
								onClick={() => onSelect?.(date)}
								className={cn(
									"relative h-10 sm:h-12 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center transition-colors",
									isSelected ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground hover:bg-accent",
									isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
								)}
							>
								{date.getDate()}
								{hasEvent && (
									<span
										className={cn(
											"absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
											isSelected ? "bg-primary-foreground/90" : "bg-primary",
										)}
									/>
								)}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
