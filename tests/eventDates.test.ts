// Run: node --test --experimental-strip-types tests/eventDates.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { getEventWhen, formatEventRangeShort } from "../libs/eventDates.ts";

const d = (y: number, m: number, day: number, h = 0, min = 0) => new Date(y, m - 1, day, h, min);

test("single day shows one date and a time range", () => {
	const w = getEventWhen(d(2026, 10, 27, 9), d(2026, 10, 27, 11), "en");
	assert.equal(w.kind, "single");
	assert.match(w.dateText, /Oct 27, 2026/);
	assert.match(w.timeText, /9:00.*11:00/);
});

test("two-day event with real times is multi with start and end", () => {
	const w = getEventWhen(d(2026, 10, 27, 18), d(2026, 10, 28, 2, 30), "en");
	assert.equal(w.kind, "multi");
	assert.match(w.startText, /Oct 27.*6:00/);
	assert.match(w.endText, /Oct 28.*2:30/);
});

test("midnight to midnight across days is all-day, never 12:00 AM - 12:00 AM", () => {
	const w = getEventWhen(d(2026, 10, 27), d(2026, 10, 29), "en");
	assert.equal(w.kind, "allDay");
	assert.match(w.dateText, /Oct 27.*Oct 28/);
	assert.doesNotMatch(JSON.stringify(w), /12:00/);
});

test("00:00 to 23:59 on one day is all-day for that day", () => {
	const w = getEventWhen(d(2026, 10, 27), d(2026, 10, 27, 23, 59), "en");
	assert.equal(w.kind, "allDay");
	assert.match(w.dateText, /Oct 27, 2026/);
});

test("missing or backwards end shows the start only", () => {
	assert.equal(getEventWhen(d(2026, 10, 27, 9), null, "en").kind, "point");
	assert.equal(getEventWhen(d(2026, 10, 27, 9), d(2026, 10, 27, 8), "en").kind, "point");
	assert.equal(getEventWhen(undefined, undefined, "en").dateText, "");
});

test("works in every app locale and falls back for a bad one", () => {
	for (const loc of ["en", "ko", "ru", "uz", "xx-invalid-locale-zz"]) {
		const w = getEventWhen(d(2026, 10, 27, 9), d(2026, 10, 29, 17), loc);
		assert.equal(w.kind, "multi", loc);
		assert.ok(w.startText.length > 5 && w.endText.length > 5, loc);
	}
});

test("short card text covers all kinds", () => {
	assert.match(formatEventRangeShort(d(2026, 10, 27, 9), d(2026, 10, 27, 11), "en"), /Oct 27, 9:00.*11:00/);
	assert.match(formatEventRangeShort(d(2026, 10, 27, 9), d(2026, 10, 29, 17), "en"), /Oct 27.*Oct 29/);
	assert.match(formatEventRangeShort(d(2026, 10, 27), d(2026, 10, 29), "en", "All day"), /All day/);
});
