import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { Calendar, ArrowUpDown, X } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/libs/components/ui/popover';
import { Button, buttonVariants } from '@/libs/components/ui/button';
import { Calendar as CalendarComponent } from '@/libs/components/ui/calendar';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';

import { cn } from '@/libs/utils';
import { smallError } from '@/libs/alert';
import { eventsSortOptions } from '@/libs/config';
import { EventsInquiry } from '@/libs/types/event/event.input';
import { Direction, Message } from '@/libs/enums/common.enum';

interface SortAndFilterProps {
	updateURL: (search: EventsInquiry) => void;
	eventsSearchFilters: EventsInquiry;
	initialSearch: EventsInquiry;
}

function SortAndFilter({ updateURL, eventsSearchFilters, initialSearch }: SortAndFilterProps) {
	const { t } = useTranslation('common');

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
		<div className="rounded-2xl shadow-lg p-6 relative border-2 border-border/80 bg-background/70 backdrop-blur-md w-full max-w-5xl mx-auto">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-10">
				{/* 🔍 Search Bar */}
				<Input
					placeholder={t('Search events') + '...'}
					value={eventsSearchFilters.search?.text}
					onChange={(e) => searchHandler(e.target.value)}
					className={cn(
						buttonVariants({ variant: 'ghost', size: 'icon' }),
						'w-full sm:w-auto bg-background/80 backdrop-blur-sm border-border/50 transition-colors hover:bg-accent/50',
					)}
				/>

				{/* Date Pickers */}
				<div className="flex flex-wrap gap-4">
					{/* Start Date */}
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-full sm:w-auto bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
							>
								<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
								{eventsSearchFilters.search.eventStartDay
									? format(eventsSearchFilters.search.eventStartDay, 'MMM d, yyyy')
									: t('Start date')}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 z-[1000]" align="start">
							<div className="bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
								<CalendarComponent
									mode="single"
									selected={eventsSearchFilters.search.eventStartDay}
									onSelect={startDateHandler}
									initialFocus
									disabled={(date) =>
										date < new Date() ||
										(eventsSearchFilters.search?.eventEndDay ? date > eventsSearchFilters.search.eventEndDay : false)
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
								className="w-full sm:w-auto bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
							>
								<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
								{eventsSearchFilters.search.eventEndDay
									? format(eventsSearchFilters.search.eventEndDay, 'MMM d, yyyy')
									: t('End date')}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 z-[1000]" align="start">
							<div className="bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
								<CalendarComponent
									mode="single"
									selected={eventsSearchFilters.search.eventEndDay}
									onSelect={endDateHandler}
									initialFocus
									disabled={(date) =>
										date < new Date() ||
										(eventsSearchFilters.search?.eventStartDay
											? date < eventsSearchFilters.search.eventStartDay
											: false)
									}
								/>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{/* 🔽 Sort + Direction + Clear */}
				<div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
					<Select value={eventsSearchFilters.sort} onValueChange={sortHandler}>
						<SelectTrigger className="h-11 min-w-[120px]">
							<ArrowUpDown className="text-muted-foreground mr-2" />
							<SelectValue placeholder={t('Sort by')} />
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
						className="w-14 h-11 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
					>
						<span
							className={cn(
								eventsSearchFilters.direction === Direction.ASC
									? 'text-lg font-bold text-primary'
									: 'text-muted-foreground',
							)}
						>
							↑
						</span>
						<span
							className={cn(
								eventsSearchFilters.direction === Direction.DESC
									? 'text-lg font-bold text-primary'
									: 'text-muted-foreground',
							)}
						>
							↓
						</span>
					</Button>

					<Button
						variant="outline"
						onClick={clearAllHandler}
						className="h-11 hover:bg-accent hover:text-accent-foreground"
					>
						<X className="h-4 w-4 mr-2" />
						{t('Clear')}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilter;
