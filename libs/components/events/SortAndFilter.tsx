import { format, Locale } from "date-fns";
import { enUS, ko, ru, uz } from "date-fns/locale";
import { ArrowUpDown, Calendar, X } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import { Calendar as CalendarComponent } from "@/libs/components/common/calendar";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/libs/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { smallError } from "@/libs/alert";
import { FiltersToggle } from "@/libs/components/common/FiltersToggle";
import { eventsSortOptions } from "@/libs/config";
import { Direction } from "@/libs/enums/common.enum";
import { useDebouncedText } from "@/libs/hooks/useDebouncedText";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { cn } from "@/libs/utils";

interface SortAndFilterProps {
	updateURL: (search: EventsInquiry) => void;
	eventsSearchFilters: EventsInquiry;
	initialSearch: EventsInquiry;
}

function SortAndFilter({ updateURL, eventsSearchFilters, initialSearch }: SortAndFilterProps) {
	const { t, i18n } = useTranslation("events");

	const localeMap: Record<string, Locale> = {
		en: enUS,
		ko: ko,
		ru: ru,
		uz: uz,
	};

	const currentLocale = localeMap[i18n.language] || enUS;

	const searchHandler = (text: string) => {
		updateURL({
			...eventsSearchFilters,
			page: 1,
			search: {
				...eventsSearchFilters.search,
				text: text,
			},
		});
	};

	const [searchText, setSearchText] = useDebouncedText(eventsSearchFilters.search?.text ?? "", searchHandler);

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

		if (!sortOption) smallError(t("errors:invalid_sort_option"));

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

	// Phones: only the search box shows; the rest opens behind a "Filters" button.
	const [filtersOpen, setFiltersOpen] = useState(false);
	const search = eventsSearchFilters.search;
	const sameDay = (a?: Date, b?: Date) => !!a && !!b && new Date(a).toDateString() === new Date(b).toDateString();
	const activeFilterCount =
		(search?.eventEndDay ? 1 : 0) +
		(search?.eventStartDay && !sameDay(search.eventStartDay, initialSearch.search?.eventStartDay) ? 1 : 0) +
		(eventsSearchFilters.sort !== initialSearch.sort ? 1 : 0) +
		(eventsSearchFilters.direction !== initialSearch.direction ? 1 : 0);
	const phoneHidden = !filtersOpen && "max-sm:hidden";

	return (
		<div className="rounded-2xl shadow-lg p-3 sm:p-6 relative border-2 border-border/80 bg-background/70 backdrop-blur-md w-full max-w-5xl mx-auto">
			<div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
				{/* Left: search + dates */}
				<div className="min-w-0 grid grid-cols-2 gap-2 sm:gap-4 lg:flex lg:flex-wrap lg:items-center lg:gap-4 lg:flex-1">
					{/* 🔍 Search Bar */}
					<div className="col-span-2 flex min-w-0 gap-2 lg:flex-none">
						<Input
							type="search"
							enterKeyHint="search"
							aria-label={t("search_events")}
							placeholder={t("search_events") + "..."}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							className="h-11 w-full lg:w-auto lg:min-w-[240px] bg-background/80 backdrop-blur-sm transition-colors hover:bg-accent/50"
						/>
						<FiltersToggle
							label={t("filters")}
							open={filtersOpen}
							count={activeFilterCount}
							onToggle={() => setFiltersOpen((v) => !v)}
						/>
					</div>

					{/* Start Date */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className={cn(
									"h-11 w-full lg:w-auto justify-start bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors",
									phoneHidden,
								)}
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
								className={cn(
									"h-11 w-full lg:w-auto justify-start bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors",
									phoneHidden,
								)}
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
				<div
					className={cn(
						phoneHidden,
						"grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-4 lg:flex-none",
					)}
				>
					<Select value={eventsSearchFilters.sort} onValueChange={sortHandler}>
						<SelectTrigger className="h-11 data-[size=default]:h-11 w-full sm:min-w-[160px] lg:w-auto lg:min-w-[160px]">
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
						className="w-11 sm:w-full lg:w-14 h-11 bg-background/80 backdrop-blur-sm hover:bg-accent/50 transition-colors"
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
						aria-label={t("clear")}
						className="w-11 px-0 sm:w-full sm:px-4 lg:w-auto h-11 hover:bg-accent hover:text-accent-foreground"
					>
						<X className="h-4 w-4 sm:mr-2" />
						<span className="hidden sm:inline">{t("clear")}</span>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilter;
