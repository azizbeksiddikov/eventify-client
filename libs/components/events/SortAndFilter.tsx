import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Button, buttonVariants } from '../ui/button';
import { Input } from '../ui/input';
import { EventsInquiry } from '@/libs/types/event/event.input';
import { Direction } from '@/libs/enums/common.enum';
import { Calendar, ArrowUpDown, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { cn } from '@/libs/utils';

const sortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'eventDate', label: 'Event Date' },
	{ value: 'eventPrice', label: 'Price' },
	{ value: 'attendeeCount', label: 'Popularity' },
];

interface SortAndFilterProps {
	updateURL: (search: EventsInquiry) => void;
	eventSearch: EventsInquiry;
}

function SortAndFilter({ updateURL, eventSearch }: SortAndFilterProps) {
	const handleSearch = (text: string) => {
		updateURL({
			...eventSearch,
			search: {
				text: text,
			},
		});
	};

	const handleStartDateChange = (date: Date | undefined) => {
		const today = new Date();
		const startDate = date || today;

		// If end date exists and is before the new start date, clear it
		if (eventSearch.search.eventEndDay && startDate > eventSearch.search.eventEndDay) {
			updateURL({
				...eventSearch,
				search: {
					...eventSearch.search,
					eventStartDay: startDate,
					eventEndDay: undefined,
				},
			});
		} else {
			updateURL({
				...eventSearch,
				search: {
					...eventSearch.search,
					eventStartDay: startDate,
				},
			});
		}
	};

	const handleEndDateChange = (date: Date | undefined) => {
		const today = new Date();
		const endDate = date || today;

		// Only allow end date if it's after start date or if start date is not set
		if (!eventSearch.search.eventStartDay || endDate >= eventSearch.search.eventStartDay) {
			updateURL({
				...eventSearch,
				search: {
					...eventSearch.search,
					eventEndDay: endDate,
				},
			});
		}
	};

	const handleSortChange = (value: string) => {
		updateURL({
			...eventSearch,
			sort: value as keyof Event,
		});
	};

	const toggleDirection = () => {
		updateURL({
			...eventSearch,
			direction: eventSearch.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		});
	};

	const clearAllFilters = () => {
		updateURL({
			search: {
				text: '',
				eventStartDay: undefined,
				eventEndDay: undefined,
			},
			sort: 'createdAt',
			direction: Direction.DESC,
			page: 1,
			limit: 10,
		});
	};

	return (
		<div className="rounded-2xl shadow-lg p-6 mb-8 relative  border-border/80 border-2 w-[75%] mx-auto">
			<div className="flex flex-row items-center justify-between gap-12">
				<Input
					placeholder="Search events..."
					value={eventSearch.search?.text}
					onChange={(e) => handleSearch(e.target.value)}
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
								{format(eventSearch.search.eventStartDay || new Date(), 'MMM d, yyyy')}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 z-[1000]" align="start">
							<div className="bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
								<CalendarComponent
									mode="single"
									selected={eventSearch.search.eventStartDay || new Date()}
									onSelect={handleStartDateChange}
									initialFocus
									disabled={(date) =>
										date < new Date() ||
										(eventSearch.search.eventEndDay ? date > eventSearch.search.eventEndDay : false)
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
								{format(eventSearch.search.eventEndDay || new Date(), 'MMM d, yyyy')}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 z-[1000]" align="start">
							<div className="bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
								<CalendarComponent
									mode="single"
									selected={eventSearch.search.eventEndDay || new Date()}
									onSelect={handleEndDateChange}
									initialFocus
									disabled={(date) =>
										date < new Date() ||
										(eventSearch.search.eventStartDay ? date < eventSearch.search.eventStartDay : false)
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
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-40 justify-start text-left font-normal bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
							>
								<ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
								{sortOptions.find((option) => option.value === eventSearch.sort)?.label}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-48 z-[1000] bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
							<div className="space-y-2 p-2">
								{sortOptions.map((option) => (
									<Button
										key={option.value}
										variant="ghost"
										className="w-full justify-start hover:bg-accent/50 transition-colors"
										onClick={() => handleSortChange(option.value)}
									>
										{option.label}
									</Button>
								))}
							</div>
						</PopoverContent>
					</Popover>

					<Button
						variant="outline"
						size="icon"
						onClick={toggleDirection}
						className="w-16 h-9 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors flex items-center justify-center gap-1"
					>
						<span
							className={`${eventSearch.direction === Direction.ASC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
						>
							↑
						</span>
						<span
							className={`${eventSearch.direction === Direction.DESC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
						>
							↓
						</span>
					</Button>

					<Button
						variant="outline"
						size="icon"
						onClick={clearAllFilters}
						className="w-9 h-9 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
					>
						<X className="h-4 w-4 text-muted-foreground" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilter;
