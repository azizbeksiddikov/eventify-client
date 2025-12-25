"use client";

import { useTranslation } from "next-i18next";
import { format, Locale } from "date-fns";
import { enUS, ko, ru, uz } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/libs/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { ScrollArea } from "@/libs/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/libs/components/ui/popover";
import { Calendar } from "@/libs/components/common/calendar";

interface EventDateAndTimePickerProps {
	startDate: Date;
	endDate: Date;
	onStartDateChange: (date: Date) => void;
	onEndDateChange: (date: Date) => void;
	onStartTimeChange: (date: Date) => void;
	onEndTimeChange: (date: Date) => void;
	locale?: string;
	className?: string;
	useCalendar?: boolean; // For create page (uses Calendar), update page uses native date input
}

export const EventDateAndTimePicker = ({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	onStartTimeChange,
	onEndTimeChange,
	locale = "en",
	className,
	useCalendar = true,
}: EventDateAndTimePickerProps) => {
	const { t, i18n } = useTranslation("events");

	const localeMap: Record<string, Locale> = {
		en: enUS,
		ko: ko,
		ru: ru,
		uz: uz,
	};

	const currentLocale = localeMap[locale || i18n.language] || enUS;

	const handleStartDateSelect = (date: Date | undefined) => {
		if (!date) return;
		const currentTime = new Date(startDate);
		date.setHours(currentTime.getHours());
		date.setMinutes(currentTime.getMinutes());
		date.setSeconds(currentTime.getSeconds());
		const newStartDate = date;

		// If end date is before or equal to new start date, adjust it
		if (endDate <= newStartDate) {
			const newEndDate = new Date(newStartDate);
			newEndDate.setHours(newEndDate.getHours() + 1);
			onStartDateChange(newStartDate);
			onEndDateChange(newEndDate);
		} else {
			onStartDateChange(newStartDate);
		}
	};

	const handleEndDateSelect = (date: Date | undefined) => {
		if (!date) return;
		const currentTime = new Date(endDate);
		date.setHours(currentTime.getHours());
		date.setMinutes(currentTime.getMinutes());
		date.setSeconds(currentTime.getSeconds());
		const newEndDate = date;

		// If end date is before or equal to start date, adjust it
		if (newEndDate <= startDate) {
			const adjustedEndDate = new Date(startDate);
			adjustedEndDate.setHours(adjustedEndDate.getHours() + 1);
			onEndDateChange(adjustedEndDate);
		} else {
			onEndDateChange(newEndDate);
		}
	};

	const handleStartHourChange = (hour: string) => {
		const currentTime = new Date(startDate);
		currentTime.setHours(Number(hour));
		const newStartDate = currentTime;

		if (endDate <= newStartDate) {
			const newEndDate = new Date(newStartDate);
			newEndDate.setHours(newEndDate.getHours() + 1);
			onStartTimeChange(newStartDate);
			onEndTimeChange(newEndDate);
		} else {
			onStartTimeChange(newStartDate);
		}
	};

	const handleStartMinuteChange = (minute: string) => {
		const currentTime = new Date(startDate);
		currentTime.setMinutes(Number(minute));
		const newStartDate = currentTime;

		if (endDate <= newStartDate) {
			const newEndDate = new Date(newStartDate);
			newEndDate.setMinutes(newEndDate.getMinutes() + 30);
			onStartTimeChange(newStartDate);
			onEndTimeChange(newEndDate);
		} else {
			onStartTimeChange(newStartDate);
		}
	};

	const handleEndHourChange = (hour: string) => {
		const currentTime = new Date(endDate);
		currentTime.setHours(Number(hour));
		const newEndDate = currentTime;

		if (newEndDate <= startDate) {
			const adjustedEndDate = new Date(startDate);
			adjustedEndDate.setHours(adjustedEndDate.getHours() + 1);
			onEndTimeChange(adjustedEndDate);
		} else {
			onEndTimeChange(newEndDate);
		}
	};

	const handleEndMinuteChange = (minute: string) => {
		const currentTime = new Date(endDate);
		currentTime.setMinutes(Number(minute));
		const newEndDate = currentTime;

		if (newEndDate <= startDate) {
			const adjustedEndDate = new Date(startDate);
			adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() + 30);
			onEndTimeChange(adjustedEndDate);
		} else {
			onEndTimeChange(newEndDate);
		}
	};

	return (
		<div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className || ""}`}>
			{/* Start Date and Time */}
			<div className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="eventStartDate" className="text-sm font-medium text-foreground">
						{t("start_date")} *
					</label>
					{useCalendar ? (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start text-left font-normal bg-input text-input-foreground border-input"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{format(new Date(startDate), "PPP", { locale: currentLocale })}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={new Date(startDate)}
									onSelect={handleStartDateSelect}
									initialFocus
									locale={currentLocale}
									disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
								/>
							</PopoverContent>
						</Popover>
					) : (
						<input
							type="date"
							id="eventStartDate"
							value={format(new Date(startDate), "yyyy-MM-dd")}
							onChange={(e) => {
								if (!e.target.value) return;
								const selectedDate = new Date(e.target.value + "T00:00:00");
								if (!isNaN(selectedDate.getTime())) {
									handleStartDateSelect(selectedDate);
								}
							}}
							className="w-full px-3 py-2 border rounded-md bg-input text-input-foreground border-input"
						/>
					)}
				</div>
				<div className="space-y-2">
					<label htmlFor="eventStartTime" className="text-sm font-medium text-foreground">
						{t("start_time")} *
					</label>
					<div className="flex gap-2">
						<Select value={startDate.getHours().toString().padStart(2, "0")} onValueChange={handleStartHourChange}>
							<SelectTrigger className={`w-20 ${className || ""}`}>
								<SelectValue placeholder="HH" />
							</SelectTrigger>
							<SelectContent className={className}>
								<ScrollArea className="h-[200px]">
									{[...Array(24)].map((_, i) => (
										<SelectItem key={i} value={i.toString().padStart(2, "0")} className={className}>
											{i.toString().padStart(2, "0")}
										</SelectItem>
									))}
								</ScrollArea>
							</SelectContent>
						</Select>
						<Select value={startDate.getMinutes().toString().padStart(2, "0")} onValueChange={handleStartMinuteChange}>
							<SelectTrigger className={`w-20 ${className || ""}`}>
								<SelectValue placeholder="MM" />
							</SelectTrigger>
							<SelectContent className={className}>
								<ScrollArea className="h-[200px]">
									{[...Array(12)].map((_, i) => {
										const minute = (i * 5).toString().padStart(2, "0");
										return (
											<SelectItem key={minute} value={minute} className={className}>
												{minute}
											</SelectItem>
										);
									})}
								</ScrollArea>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* End Date and Time */}
			<div className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="eventEndDate" className="text-sm font-medium text-foreground">
						{t("end_date")} *
					</label>
					{useCalendar ? (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start text-left font-normal bg-input text-input-foreground border-input"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{format(new Date(endDate), "PPP", { locale: currentLocale })}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={new Date(endDate)}
									onSelect={handleEndDateSelect}
									initialFocus
									locale={currentLocale}
									disabled={(date) => date < new Date(startDate)}
								/>
							</PopoverContent>
						</Popover>
					) : (
						<input
							type="date"
							id="eventEndDate"
							value={format(new Date(endDate), "yyyy-MM-dd")}
							onChange={(e) => {
								if (!e.target.value) return;
								const selectedDate = new Date(e.target.value + "T00:00:00");
								if (!isNaN(selectedDate.getTime())) {
									handleEndDateSelect(selectedDate);
								}
							}}
							className="w-full px-3 py-2 border rounded-md bg-input text-input-foreground border-input"
						/>
					)}
				</div>
				<div className="space-y-2">
					<label htmlFor="eventEndTime" className="text-sm font-medium text-foreground">
						{t("end_time")} *
					</label>
					<div className="flex gap-2">
						<Select value={endDate.getHours().toString().padStart(2, "0")} onValueChange={handleEndHourChange}>
							<SelectTrigger className={`w-20 ${className || ""}`}>
								<SelectValue placeholder="HH" />
							</SelectTrigger>
							<SelectContent className={className}>
								<ScrollArea className="h-[200px]">
									{[...Array(24)].map((_, i) => (
										<SelectItem key={i} value={i.toString().padStart(2, "0")} className={className}>
											{i.toString().padStart(2, "0")}
										</SelectItem>
									))}
								</ScrollArea>
							</SelectContent>
						</Select>
						<Select value={endDate.getMinutes().toString().padStart(2, "0")} onValueChange={handleEndMinuteChange}>
							<SelectTrigger className={`w-20 ${className || ""}`}>
								<SelectValue placeholder="MM" />
							</SelectTrigger>
							<SelectContent className={className}>
								<ScrollArea className="h-[200px]">
									{[...Array(12)].map((_, i) => {
										const minute = (i * 5).toString().padStart(2, "0");
										return (
											<SelectItem key={minute} value={minute} className={className}>
												{minute}
											</SelectItem>
										);
									})}
								</ScrollArea>
							</SelectContent>
						</Select>
					</div>
					{endDate <= startDate && (
						<p className="text-sm text-destructive mt-1">{t("end_date_must_be_after_start_date")}</p>
					)}
				</div>
			</div>
		</div>
	);
};
