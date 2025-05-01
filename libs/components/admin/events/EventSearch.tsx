import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { EventCategory, EventStatus } from '@/libs/enums/event.enum';
import { Direction } from '@/libs/enums/common.enum';

interface EventsInquiry {
	page: number;
	limit: number;
	sort: string;
	direction: Direction;
	search: {
		text: string;
		category?: EventCategory;
		status?: EventStatus;
	};
}

interface EventSearchProps {
	eventsInquiry: EventsInquiry;
	setEventsInquiry: (inquiry: EventsInquiry) => void;
}

export function EventSearch({ eventsInquiry, setEventsInquiry }: EventSearchProps) {
	const searchTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEventsInquiry({
			...eventsInquiry,
			search: {
				...eventsInquiry.search,
				text: e.target.value,
			},
		});
	};

	const clearSearchHandler = () => {
		setEventsInquiry({
			...eventsInquiry,
			search: {
				text: '',
				category: undefined,
				status: undefined,
			},
		});
	};

	const changeCategoryHandler = (value: string) => {
		setEventsInquiry({
			...eventsInquiry,
			search: {
				...eventsInquiry.search,
				category: value === 'all' ? undefined : (value as EventCategory),
			},
		});
	};

	const changeStatusHandler = (value: string) => {
		setEventsInquiry({
			...eventsInquiry,
			search: {
				...eventsInquiry.search,
				status: value === 'all' ? undefined : (value as EventStatus),
			},
		});
	};

	const changeSortHandler = (value: string) => {
		setEventsInquiry({
			...eventsInquiry,
			sort: value,
		});
	};

	return (
		<div className="flex items-center gap-6 p-6 rounded-t-lg bg-card border border-border">
			<Input
				placeholder="Search events..."
				value={eventsInquiry?.search?.text ?? ''}
				onChange={searchTextHandler}
				className="w-full bg-background text-foreground border-input focus:ring-primary"
			/>
			<Select value={eventsInquiry?.sort} onValueChange={changeSortHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="createdAt">Created At</SelectItem>
					<SelectItem value="eventDate">Event Date</SelectItem>
					<SelectItem value="attendeeCount">Attendees</SelectItem>
					<SelectItem value="eventPrice">Price</SelectItem>
				</SelectContent>
			</Select>
			<Select value={eventsInquiry?.search?.category ?? 'all'} onValueChange={changeCategoryHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Filter by category" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="all">All Categories</SelectItem>
					<SelectItem value={EventCategory.SPORTS}>Sports</SelectItem>
					<SelectItem value={EventCategory.ART}>Art</SelectItem>
					<SelectItem value={EventCategory.TECHNOLOGY}>Technology</SelectItem>
					<SelectItem value={EventCategory.FOOD}>Food</SelectItem>
					<SelectItem value={EventCategory.TRAVEL}>Travel</SelectItem>
					<SelectItem value={EventCategory.EDUCATION}>Education</SelectItem>
					<SelectItem value={EventCategory.HEALTH}>Health</SelectItem>
					<SelectItem value={EventCategory.ENTERTAINMENT}>Entertainment</SelectItem>
					<SelectItem value={EventCategory.BUSINESS}>Business</SelectItem>
					<SelectItem value={EventCategory.POLITICS}>Politics</SelectItem>
					<SelectItem value={EventCategory.RELIGION}>Religion</SelectItem>
					<SelectItem value={EventCategory.OTHER}>Other</SelectItem>
				</SelectContent>
			</Select>
			<Select value={eventsInquiry?.search?.status ?? 'all'} onValueChange={changeStatusHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Filter by status" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="all">All Statuses</SelectItem>
					<SelectItem value={EventStatus.UPCOMING}>Upcoming</SelectItem>
					<SelectItem value={EventStatus.ONGOING}>Ongoing</SelectItem>
					<SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
					<SelectItem value={EventStatus.CANCELLED}>Cancelled</SelectItem>
					<SelectItem value={EventStatus.DELETED}>Deleted</SelectItem>
				</SelectContent>
			</Select>
			<Button
				variant="outline"
				onClick={clearSearchHandler}
				className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
			>
				Clear
			</Button>
		</div>
	);
}
