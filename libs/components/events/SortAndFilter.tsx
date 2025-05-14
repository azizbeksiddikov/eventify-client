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
import { Direction } from '@/libs/enums/common.enum';

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

		if (!sortOption) smallError(t('Invalid sort option'));

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

	const clearAllFilters = () => {
		updateURL(initialSearch);
	};

	return (
		<div className="rounded-2xl shadow-lg p-6 relative  border-border/80 border-2 w-[75%] mx-auto">
			<div className="flex flex-row items-center justify-between gap-12">
				<Input
					placeholder={t('Search events...')}
					value={eventsSearchFilters.search?.text}
					onChange={(e) => searchHandler(e.target.value)}
					className={cn(
						buttonVariants({ variant: 'ghost', size: 'icon' }),
						'w-[400px] bg-background/80  backdrop-blur-sm border-border/50 transition-colors  hover:bg-accent/50    ',
					)}
				/>

				<div className="flex items-center gap-6">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-48 justify-start text-left font-normal bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
							>
								<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
								{eventsSearchFilters.search.eventStartDay
									? format(eventsSearchFilters.search.eventStartDay, 'MMM d, yyyy')
									: t('Start Date')}
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
										(eventsSearchFilters.search.eventEndDay ? date > eventsSearchFilters.search.eventEndDay : false)
									}
									className="rounded-md"
									classNames={{
										months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
										month: 'space-y-4',
										caption: 'flex justify-center pt-1 relative items-center',
										caption_label: 'text-sm font-medium text-foreground',
										nav: 'space-x-1 flex items-center',
										nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground',
										nav_button_previous: 'absolute left-1',
										nav_button_next: 'absolute right-1',
										table: 'w-full border-collapse space-y-1',
										head_row: 'flex',
										head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
										row: 'flex w-full mt-2',
										cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
										day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/50 rounded-md transition-colors',
										day_selected:
											'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
										day_today: 'bg-accent text-accent-foreground',
										day_outside: 'text-muted-foreground opacity-50',
										day_disabled: 'text-muted-foreground opacity-50',
										day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
										day_hidden: 'invisible',
									}}
								/>
							</div>
						</PopoverContent>
					</Popover>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-48 justify-start text-left font-normal bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
							>
								<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
								{eventsSearchFilters.search.eventEndDay
									? format(eventsSearchFilters.search.eventEndDay, 'MMM d, yyyy')
									: t('End Date')}
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
										(eventsSearchFilters.search.eventStartDay ? date < eventsSearchFilters.search.eventStartDay : false)
									}
									className="rounded-md"
									classNames={{
										months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
										month: 'space-y-4',
										caption: 'flex justify-center pt-1 relative items-center',
										caption_label: 'text-sm font-medium text-foreground',
										nav: 'space-x-1 flex items-center',
										nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground',
										nav_button_previous: 'absolute left-1',
										nav_button_next: 'absolute right-1',
										table: 'w-full border-collapse space-y-1',
										head_row: 'flex',
										head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
										row: 'flex w-full mt-2',
										cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
										day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/50 rounded-md transition-colors',
										day_selected:
											'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
										day_today: 'bg-accent text-accent-foreground',
										day_outside: 'text-muted-foreground opacity-50',
										day_disabled: 'text-muted-foreground opacity-50',
										day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
										day_hidden: 'invisible',
									}}
								/>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				<div className="flex items-center gap-4">
					<Select value={eventsSearchFilters.sort} onValueChange={sortHandler}>
						<SelectTrigger className="w-[180px] h-11">
							<ArrowUpDown className="text-muted-foreground" />
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
						className="w-16 h-9 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors flex items-center justify-center gap-1"
					>
						<span
							className={`${eventsSearchFilters.direction === Direction.ASC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
						>
							↑
						</span>
						<span
							className={`${eventsSearchFilters.direction === Direction.DESC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
						>
							↓
						</span>
					</Button>

					<Button
						variant="outline"
						onClick={clearAllFilters}
						className="h-11 hover:bg-accent hover:text-accent-foreground"
					>
						<X className="h-4 w-4 " />
						{t('Clear')}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilter;
