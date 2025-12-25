import type React from "react";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/navigation";
import { format, Locale } from "date-fns";
import { enUS, ko, ru, uz } from "date-fns/locale";
import { CalendarIcon, SearchIcon } from "lucide-react";

import { Input } from "@/libs/components/ui/input";
import { Button } from "@/libs/components/ui/button";
import { Card } from "@/libs/components/ui/card";
import { Calendar } from "@/libs/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/libs/components/ui/popover";
import { formatDateForInput } from "@/libs/utils";

const SearchEvents = () => {
	const router = useRouter();
	const { t, i18n } = useTranslation("home");

	const localeMap: Record<string, Locale> = {
		en: enUS,
		ko: ko,
		ru: ru,
		uz: uz,
	};

	const currentLocale = localeMap[i18n.language] || enUS;

	const [text, setText] = useState("");
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();

	const handleStartDateChange = (date: Date | undefined) => {
		setStartDate(date);
		// If new startDate is after endDate, clear endDate
		if (date && endDate && date > endDate) {
			setEndDate(undefined);
		}
	};

	const handleEndDateChange = (date: Date | undefined) => {
		setEndDate(date);
		// If new endDate is before startDate, clear startDate
		if (date && startDate && date < startDate) {
			setStartDate(undefined);
		}
	};

	const searchHandler = (e: React.FormEvent) => {
		e.preventDefault();

		const query: Record<string, string> = {};

		if (text.trim()) query.text = text.trim();
		if (startDate) query.startDate = formatDateForInput(startDate);
		if (endDate) query.endDate = formatDateForInput(endDate);

		router.push(`/events?${new URLSearchParams(query).toString()}`);
	};

	return (
		<div className="bg-secondary/70 py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 shadow-lg w-full">
			<div className="px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
				<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6 md:mb-8 text-center font-bold">
					{t("find_events")}
				</h2>
				<Card className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-5xl mx-auto border-2 border-primary/20 shadow-md">
					<form
						onSubmit={searchHandler}
						className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4"
					>
						<div className="flex-1 relative w-full">
							<Input
								type="text"
								placeholder={t("search_events")}
								className="w-full h-10 sm:h-11 md:h-12 lg:h-14 text-sm sm:text-base md:text-lg pl-9 sm:pl-10 rounded-md focus:ring-2 focus:ring-primary/50 transition-all"
								value={text}
								onChange={(e) => setText(e.target.value)}
							/>
							<SearchIcon className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground pointer-events-none" />
						</div>

						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="h-10 sm:h-11 md:h-12 lg:h-14 justify-start text-left font-normal border border-input hover:bg-accent/50 transition-colors text-xs sm:text-sm md:text-base w-full sm:flex-1"
									>
										<CalendarIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 shrink-0" />
										<span className="truncate">
											{startDate ? format(startDate, "PPP", { locale: currentLocale }) : <span>{t("start_date")}</span>}
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={startDate}
										onSelect={handleStartDateChange}
										initialFocus
										locale={currentLocale}
										disabled={(date) => (endDate ? date > endDate : false)}
									/>
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="h-10 sm:h-11 md:h-12 lg:h-14 justify-start text-left font-normal border border-input hover:bg-accent/50 transition-colors text-xs sm:text-sm md:text-base w-full sm:flex-1"
									>
										<CalendarIcon className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 shrink-0" />
										<span className="truncate">
											{endDate ? format(endDate, "PPP", { locale: currentLocale }) : <span>{t("end_date")}</span>}
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={endDate}
										onSelect={handleEndDateChange}
										initialFocus
										locale={currentLocale}
										disabled={(date) => (startDate ? date < startDate : false)}
									/>
								</PopoverContent>
							</Popover>
						</div>
						<Button
							type="submit"
							className="h-10 sm:h-11 md:h-12 lg:h-14 px-4 sm:px-5 md:px-6 lg:px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base w-full md:w-auto"
						>
							{t("search")}
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default SearchEvents;
