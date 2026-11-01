/**
 * How an event's start and end are shown. Pure functions, no React, so they can be tested.
 *
 * - single day:      date + "9:00 AM - 11:00 AM"
 * - several days:    "starts ..." and "ends ..." each with date and time
 * - all day:         date (or a date range) + "All day". There is no all-day flag in the API, so
 *                    an event is all-day when it starts at 00:00 and ends at 23:59 or at 00:00
 *                    of a later day (that end is exclusive, like calendar apps).
 */
export type EventWhen = {
	kind: "point" | "single" | "multi" | "allDay";
	/** Date line. For multi-day all-day events this is a range. */
	dateText: string;
	/** Time line for point, single and allDay kinds ("" for multi, which uses start/end). */
	timeText: string;
	/** Multi-day only: "Mon, Oct 27, 9:00 AM" style strings. */
	startText: string;
	endText: string;
};

const toDate = (v: Date | string | number | null | undefined): Date | null => {
	if (v === null || v === undefined || v === "") return null;
	const d = v instanceof Date ? v : new Date(v);
	return Number.isNaN(d.getTime()) ? null : d;
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();
const isMidnight = (d: Date) => d.getHours() === 0 && d.getMinutes() === 0;
const isEndOfDay = (d: Date) => d.getHours() === 23 && d.getMinutes() >= 59;

export function getEventWhen(
	startValue: Date | string | number | null | undefined,
	endValue: Date | string | number | null | undefined,
	locale = "en",
): EventWhen {
	const start = toDate(startValue);
	const end = toDate(endValue);
	const empty: EventWhen = { kind: "point", dateText: "", timeText: "", startText: "", endText: "" };
	if (!start) return empty;

	let loc = locale;
	try {
		Intl.DateTimeFormat.supportedLocalesOf(loc);
	} catch {
		loc = "en";
	}
	const dateFmt = new Intl.DateTimeFormat(loc, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
	const dayFmt = new Intl.DateTimeFormat(loc, { weekday: "short", month: "short", day: "numeric" });
	const timeFmt = new Intl.DateTimeFormat(loc, { hour: "numeric", minute: "2-digit" });
	const dayTime = (d: Date) => `${dayFmt.format(d)}, ${timeFmt.format(d)}`;

	// No usable end: show the start only.
	if (!end || end.getTime() <= start.getTime()) {
		return { ...empty, kind: "point", dateText: dateFmt.format(start), timeText: timeFmt.format(start) };
	}

	const allDay = isMidnight(start) && (isEndOfDay(end) || (isMidnight(end) && !sameDay(start, end)));
	if (allDay) {
		// An end at exactly 00:00 means "until the end of the previous day".
		const lastDay = isMidnight(end) ? new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1) : end;
		const dateText = sameDay(start, lastDay) ? dateFmt.format(start) : dateFmt.formatRange(start, lastDay);
		return { ...empty, kind: "allDay", dateText, timeText: "" };
	}

	if (sameDay(start, end)) {
		return {
			...empty,
			kind: "single",
			dateText: dateFmt.format(start),
			timeText: `${timeFmt.format(start)} - ${timeFmt.format(end)}`,
		};
	}

	return {
		...empty,
		kind: "multi",
		dateText: dateFmt.formatRange(start, end),
		startText: dayTime(start),
		endText: dayTime(end),
	};
}

/** One-line version for cards: "Oct 27, 9:00 AM - 11:00 AM" or "Oct 27, 9:00 AM - Oct 29, 5:00 PM". */
export function formatEventRangeShort(
	startValue: Date | string | number | null | undefined,
	endValue: Date | string | number | null | undefined,
	locale = "en",
	allDayLabel = "All day",
): string {
	const when = getEventWhen(startValue, endValue, locale);
	const start = toDate(startValue);
	if (!start) return "";
	const short = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" });
	const time = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" });
	const end = toDate(endValue);
	switch (when.kind) {
		case "point":
			return `${short.format(start)}, ${time.format(start)}`;
		case "allDay":
			return `${when.dateText} · ${allDayLabel}`;
		case "single":
			return `${short.format(start)}, ${when.timeText}`;
		default:
			return `${short.format(start)}, ${time.format(start)} - ${short.format(end as Date)}, ${time.format(end as Date)}`;
	}
}
