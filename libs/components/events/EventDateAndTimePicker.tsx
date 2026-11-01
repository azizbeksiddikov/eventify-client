"use client";

import { useTranslation } from "next-i18next";
import { Input } from "@/libs/components/ui/input";

interface EventDateAndTimePickerProps {
	startDate: Date;
	endDate: Date;
	onStartDateChange: (date: Date) => void;
	onEndDateChange: (date: Date) => void;
	// kept for the existing callers: time changes are reported through the same setters
	onStartTimeChange?: (date: Date) => void;
	onEndTimeChange?: (date: Date) => void;
	className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const toDateValue = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeValue = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** Combine a "yyyy-mm-dd" and an "hh:mm" string into a local Date (null when either is empty). */
const combine = (dateValue: string, timeValue: string): Date | null => {
	if (!dateValue || !timeValue) return null;
	const [y, m, d] = dateValue.split("-").map(Number);
	const [hh, mm] = timeValue.split(":").map(Number);
	const date = new Date(y, m - 1, d, hh, mm, 0, 0);
	return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Start and end date and time using the phone's own pickers (native date and time inputs),
 * which are the standard pattern on phones and work with the keyboard on desktop.
 * Moving the start past the end pushes the end one hour after it. An end before the start is
 * kept as typed and explained under the field, never silently changed.
 */
export const EventDateAndTimePicker = ({
	startDate: startValue,
	endDate: endValue,
	onStartDateChange,
	onEndDateChange,
	className,
}: EventDateAndTimePickerProps) => {
	const { t } = useTranslation("events");
	// the edit page may hand over ISO strings
	const startDate = new Date(startValue);
	const endDate = new Date(endValue);

	const changeStart = (dateValue: string, timeValue: string) => {
		const next = combine(dateValue, timeValue);
		if (!next) return;
		onStartDateChange(next);
		if (endDate <= next) onEndDateChange(new Date(next.getTime() + 60 * 60 * 1000));
	};
	const changeEnd = (dateValue: string, timeValue: string) => {
		const next = combine(dateValue, timeValue);
		if (next) onEndDateChange(next);
	};

	const today = toDateValue(new Date());
	const inputClass = "bg-background border-input";

	return (
		<div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className || ""}`}>
			<div className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="eventStartDate" className="text-sm font-medium text-foreground">
						{t("start_date")} *
					</label>
					<Input
						id="eventStartDate"
						type="date"
						min={today}
						value={toDateValue(startDate)}
						onChange={(e) => changeStart(e.target.value, toTimeValue(startDate))}
						className={inputClass}
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="eventStartTime" className="text-sm font-medium text-foreground">
						{t("start_time")} *
					</label>
					<Input
						id="eventStartTime"
						type="time"
						step={300}
						value={toTimeValue(startDate)}
						onChange={(e) => changeStart(toDateValue(startDate), e.target.value)}
						className={inputClass}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="eventEndDate" className="text-sm font-medium text-foreground">
						{t("end_date")} *
					</label>
					<Input
						id="eventEndDate"
						type="date"
						min={toDateValue(startDate)}
						value={toDateValue(endDate)}
						onChange={(e) => changeEnd(e.target.value, toTimeValue(endDate))}
						aria-invalid={endDate <= startDate ? true : undefined}
						aria-describedby={endDate <= startDate ? "eventEndTime-error" : undefined}
						className={inputClass}
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="eventEndTime" className="text-sm font-medium text-foreground">
						{t("end_time")} *
					</label>
					<Input
						id="eventEndTime"
						type="time"
						step={300}
						value={toTimeValue(endDate)}
						onChange={(e) => changeEnd(toDateValue(endDate), e.target.value)}
						aria-invalid={endDate <= startDate ? true : undefined}
						aria-describedby={endDate <= startDate ? "eventEndTime-error" : undefined}
						className={inputClass}
					/>
					{endDate <= startDate && (
						<p id="eventEndTime-error" role="alert" className="text-sm text-destructive">
							{t("end_time_must_be_after_start_time")}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
