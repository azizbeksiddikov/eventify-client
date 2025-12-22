import { useTranslation } from "next-i18next";
import { format } from "date-fns";
import { enUS, ko, ru, uz } from "date-fns/locale";
import { Calendar, ArrowUpDown, X } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/libs/components/ui/popover";
import { Button, buttonVariants } from "@/libs/components/ui/button";
import { Calendar as CalendarComponent } from "@/libs/components/ui/calendar";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { cn } from "@/libs/utils";
import { smallError } from "@/libs/alert";
import { eventsSortOptions } from "@/libs/config";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { Direction, Message } from "@/libs/enums/common.enum";

interface SortAndFilterProps {
	updateURL: (search: EventsInquiry) => void;
	eventsSearchFilters: EventsInquiry;
	initialSearch: EventsInquiry;
}

function SortAndFilter({ updateURL, eventsSearchFilters, initialSearch }: SortAndFilterProps) {
	const { t, i18n } = useTranslation("events");

	const localeMap: Record<string, any> = {
		en: enUS,
		ko: ko,
		ru: ru,
		uz: uz,
	};

	const currentLocale = localeMap[i18n.language] || enUS;

	const searchHandler = (text: string) => {
		updateURL({
			...eventsSearchFilters,
			search: {
				...eventsSearchFilters.search,
				text: text,
			},
		});
	};

	const startDateHandler = (date: Date | undefined) => {
		const today = new Date();
		// Set the time to noon UTC to avoid timezone issues
		const startDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)) : today;

		// If end date exists and is before the new start date, clear it
		if (eventsSearchFilters.search.eventEndDay && startDate > eventsSearchFilters.search.eventEndDay) {
			updateURL({
				...eventsSearchFilters,
				search: {
					...eventsSearchFilters.search,
					eventStartDay: startDate,
					eventEndDay: undefined,
				},
			});
		} else {
			updateURL({
				...eventsSearchFilters,
				search: {
					...eventsSearchFilters.search,
					eventStartDay: startDate,
				},
			});
		}
	};

	const endDateHandler = (date: Date | undefined) => {
		const today = new Date();
		// Set the time to noon UTC to avoid timezone issues
		const endDate = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)) : today;

		// Only allow end date if it's after start date or if start date is not set
		if (!eventsSearchFilters.search.eventStartDay || endDate >= eventsSearchFilters.search.eventStartDay) {
			updateURL({
				...eventsSearchFilters,
				search: {
					...eventsSearchFilters.search,
					eventEndDay: endDate,
				},
			});
		}
	};

	const sortHandler = (value: string) => {
		// check if the value is in the eventsSortOptions array
		const sortOption = eventsSortOptions.find((option) => option.value === value);

		if (!sortOption) smallError(t(Message.INVALID_SORT_OPTION));

		updateURL({
			...eventsSearchFilters,
			sort: sortOption?.value,
		});
	};

	const toggleDirection = () => {
		updateURL({
			...eventsSearchFilters,
			direction: eventsSearchFilters.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		});
	};

	const clearAllHandler = () => {
		updateURL(initialSearch);
	};

	return (
		<div className="rounded-2xl shadow-lg p-4 sm:p-6 relative border-2 border-border/80 bg-background/70 backdrop-blur-md w-full max-w-5xl mx-auto">
			<div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
				{/* Left: search + dates */}
				<div className="min-w-0 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:gap-4 lg:flex-1">
					{/* 🔍 Search Bar */}
					<div className="sm:col-span-2 min-w-0 lg:flex-none">
						<Input
							placeholder={t("search_events") + "..."}
							value={eventsSearchFilters.search?.text}
							onChange={(e) => searchHandler(e.target.value)}
							className="w-full lg:w-auto lg:min-w-[240px] bg-background/80 backdrop-blur-sm transition-colors hover:bg-accent/50"
						/>
					</div>

					{/* Start Date */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full lg:w-auto justify-start bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors"
							>
								<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
								<span className="truncate">
									{eventsSearchFilters.search.eventStartDay
										? format(eventsSearchFilters.search.eventStartDay, "MMM d, yyyy", { locale: currentLocale })
										: t("start_date")}
								</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 z-[1000]" align="start">
							<div className="bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
								<CalendarComponent
									mode="single"
									selected={eventsSearchFilters.search.eventStartDay}
									onSelect={startDateHandler}
									initialFocus
									locale={currentLocale}
									disabled={(date) =>
										eventsSearchFilters.search?.eventEndDay ? date > eventsSearchFilters.search.eventEndDay : false
									}
								/>
							</div>
						</PopoverContent>
					</Popover>

					{/* End Date */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full lg:w-auto justify-start bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors"
							>
								<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
								<span className="truncate">
									{eventsSearchFilters.search.eventEndDay
										? format(eventsSearchFilters.search.eventEndDay, "MMM d, yyyy", { locale: currentLocale })
										: t("end_date")}
								</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 z-[1000]" align="start">
							<div className="bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
								<CalendarComponent
									mode="single"
									selected={eventsSearchFilters.search.eventEndDay}
									onSelect={endDateHandler}
									initialFocus
									locale={currentLocale}
									disabled={(date) =>
										eventsSearchFilters.search?.eventStartDay ? date < eventsSearchFilters.search.eventStartDay : false
									}
								/>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{/* Right: sort + direction + clear */}
				<div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-4 lg:flex-none">
					<Select value={eventsSearchFilters.sort} onValueChange={sortHandler}>
						<SelectTrigger className="h-11 w-full col-span-2 sm:col-span-1 sm:min-w-[160px] lg:w-auto lg:min-w-[160px]">
							<ArrowUpDown className="text-muted-foreground mr-2" />
							<SelectValue placeholder={t("sort_by")} />
						</SelectTrigger>
						<SelectContent>
							{eventsSortOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{t(option.label)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button
						variant="outline"
						size="icon"
						onClick={toggleDirection}
						className="w-full lg:w-14 h-11 bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors"
					>
						<span
							className={cn(
								eventsSearchFilters.direction === Direction.ASC
									? "text-lg font-bold text-primary"
									: "text-muted-foreground",
							)}
						>
							↑
						</span>
						<span
							className={cn(
								eventsSearchFilters.direction === Direction.DESC
									? "text-lg font-bold text-primary"
									: "text-muted-foreground",
							)}
						>
							↓
						</span>
					</Button>

					<Button
						variant="outline"
						onClick={clearAllHandler}
						className="w-full lg:w-auto h-11 hover:bg-accent hover:text-accent-foreground"
					>
						<X className="h-4 w-4 mr-2" />
						{t("clear")}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilter;
