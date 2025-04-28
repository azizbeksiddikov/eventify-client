import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { EventCategory, EventStatus } from '../../libs/enums/event.enum';
import withBasicLayout from '../../libs/components/layout/LayoutBasic';
import { Event } from '../../libs/types/event/event';
import { EventsInquiry } from '../../libs/types/event/event.input';
import { Direction } from '../../libs/enums/common.enum';
import { Search, Calendar, Filter, MapPin, Users, ArrowUpDown, Ticket, CheckCircle2 } from 'lucide-react';
import { Button } from '../../libs/components/ui/button';
import { Input } from '../../libs/components/ui/input';
import { Badge } from '../../libs/components/ui/badge';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../../components/ui/pagination';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '../../components/ui/calendar';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const events: Event[] = [
	{
		_id: '1',
		eventName: 'Startup Pitch Night',
		eventDesc: 'An evening where startups pitch their ideas to investors.',
		eventImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
		eventDate: new Date('2025-05-15'),
		eventStartTime: '18:00',
		eventEndTime: '21:00',
		eventAddress: '123 Innovation St, Tech City',
		eventCapacity: 100,
		eventPrice: 0,
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [EventCategory.BUSINESS, EventCategory.TECHNOLOGY],
		groupId: 'group1',
		eventOrganizerId: 'user1',
		attendeeCount: 60,
		eventLikes: 120,
		eventViews: 500,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '2',
		eventName: 'AI in Healthcare Conference',
		eventDesc: 'Exploring AI advancements in healthcare technology.',
		eventImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
		eventDate: new Date('2025-06-20'),
		eventStartTime: '09:00',
		eventEndTime: '17:00',
		eventAddress: '456 Medical Ave, Health City',
		eventCapacity: 300,
		eventPrice: 150,
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [EventCategory.HEALTH, EventCategory.TECHNOLOGY, EventCategory.EDUCATION],
		groupId: 'group2',
		eventOrganizerId: 'user2',
		attendeeCount: 250,
		eventLikes: 300,
		eventViews: 1200,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '3',
		eventName: 'React Developers Meetup',
		eventDesc: 'Monthly meetup for React enthusiasts to share and learn.',
		eventImage: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
		eventDate: new Date('2025-05-10'),
		eventStartTime: '19:00',
		eventEndTime: '22:00',
		eventAddress: '789 Frontend Blvd, Code City',
		eventCapacity: 50,
		eventPrice: 10,
		eventStatus: EventStatus.ONGOING,
		eventCategories: [EventCategory.TECHNOLOGY, EventCategory.EDUCATION],
		groupId: 'group3',
		eventOrganizerId: 'user3',
		attendeeCount: 45,
		eventLikes: 80,
		eventViews: 200,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '4',
		eventName: 'Photography Workshop',
		eventDesc: 'Hands-on workshop with professional photographers.',
		eventImage: 'https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg',
		eventDate: new Date('2025-07-05'),
		eventStartTime: '10:00',
		eventEndTime: '15:00',
		eventAddress: '101 Snap Ln, Picture Town',
		eventCapacity: 25,
		eventPrice: 50,
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [EventCategory.ART, EventCategory.EDUCATION],
		groupId: 'group4',
		eventOrganizerId: 'user4',
		attendeeCount: 20,
		eventLikes: 45,
		eventViews: 150,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '5',
		eventName: 'Summer Music Festival',
		eventDesc: 'Outdoor music festival featuring popular bands and artists.',
		eventImage: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
		eventDate: new Date('2025-08-12'),
		eventStartTime: '12:00',
		eventEndTime: '23:00',
		eventAddress: '202 Harmony Rd, Sound City',
		eventCapacity: 1000,
		eventPrice: 200,
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [EventCategory.ENTERTAINMENT, EventCategory.FOOD, EventCategory.TRAVEL],
		groupId: 'group5',
		eventOrganizerId: 'user5',
		attendeeCount: 800,
		eventLikes: 1000,
		eventViews: 5000,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		_id: '6',
		eventName: 'Blockchain Bootcamp',
		eventDesc: 'Intensive weekend bootcamp for blockchain development.',
		eventImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
		eventDate: new Date('2025-05-25'),
		eventStartTime: '08:00',
		eventEndTime: '18:00',
		eventAddress: '303 Crypto St, FinTech City',
		eventCapacity: 80,
		eventPrice: 500,
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [EventCategory.TECHNOLOGY, EventCategory.BUSINESS, EventCategory.EDUCATION],
		groupId: 'group6',
		eventOrganizerId: 'user6',
		attendeeCount: 75,
		eventLikes: 150,
		eventViews: 800,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

const categories = ['ALL', ...Object.values(EventCategory)];
const sortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'eventDate', label: 'Event Date' },
	{ value: 'eventPrice', label: 'Price' },
	{ value: 'attendeeCount', label: 'Popularity' },
];

const directionOptions = [
	{ value: Direction.ASC, label: 'Ascending' },
	{ value: Direction.DESC, label: 'Descending' },
];

const initialSearch: EventsInquiry = {
	page: 1,
	limit: 6,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		text: '',
		eventCategories: [],
		eventStatus: undefined,
		eventStartDay: undefined,
		eventEndDay: undefined,
	},
};

const EventsPage = () => {
	const router = useRouter();
	const [eventSearch, setEventSearch] = useState<EventsInquiry>(() => {
		if (router?.query) {
			const categories =
				(router.query.categories as string)
					?.split(',')
					.filter(Boolean)
					.map((cat) => cat.toUpperCase() as EventCategory)
					.filter((cat) => Object.values(EventCategory).includes(cat)) || [];

			return {
				page: Number(router.query.page) || 1,
				limit: Number(router.query.limit) || 6,
				sort: (router.query.sort as keyof Event) || 'createdAt',
				direction: router.query.direction === 'asc' ? Direction.ASC : Direction.DESC,
				search: {
					text: (router.query.text as string) || '',
					eventCategories: categories,
					eventStatus: router.query.status as EventStatus,
					eventStartDay: router.query.startDate ? new Date(router.query.startDate as string) : undefined,
					eventEndDay: router.query.endDate ? new Date(router.query.endDate as string) : undefined,
				},
			};
		}
		return initialSearch;
	});
	const [searchText, setSearchText] = useState(eventSearch.search.text);
	const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>(eventSearch.search.eventCategories);
	const [dateRange, setDateRange] = useState({
		startDate: eventSearch.search.eventStartDay,
		endDate: eventSearch.search.eventEndDay,
		key: 'selection',
	});

	const updateURL = (newSearch: EventsInquiry) => {
		const query: Record<string, string> = {
			page: newSearch.page.toString(),
			limit: newSearch.limit.toString(),
			sort: newSearch.sort || 'createdAt',
			direction: newSearch.direction === Direction.ASC ? 'asc' : 'desc',
		};

		if (newSearch.search.text) {
			query.text = newSearch.search.text;
		}
		if (newSearch.search.eventCategories?.length) {
			query.categories = newSearch.search.eventCategories.join('-');
		}
		if (newSearch.search.eventStatus) {
			query.status = newSearch.search.eventStatus;
		}
		if (newSearch.search.eventStartDay) {
			query.startDate = newSearch.search.eventStartDay.toISOString();
		}
		if (newSearch.search.eventEndDay) {
			query.endDate = newSearch.search.eventEndDay.toISOString();
		}

		router.push({ query }, undefined, { shallow: true });
	};

	const handleSearch = () => {
		const newSearch = {
			...eventSearch,
			search: {
				...eventSearch.search,
				text: searchText,
			},
		};
		setEventSearch(newSearch);
		updateURL(newSearch);
	};

	const handleCategoryChange = (category: EventCategory) => {
		setSelectedCategories((prev) => {
			const newCategories = prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category];
			const newSearch = {
				...eventSearch,
				search: {
					...eventSearch.search,
					eventCategories: newCategories,
				},
			};
			setEventSearch(newSearch);
			updateURL(newSearch);
			return newCategories;
		});
	};

	const formatDateRange = (from: Date | undefined, to: Date | undefined) => {
		if (!from && !to) return 'Select dates';
		if (!to) return format(from!, 'MMM d, yyyy');
		return `${format(from!, 'MMM d')} - ${format(to, 'MMM d, yyyy')}`;
	};

	const handleDateRangeChange = (ranges: any) => {
		const range = ranges.selection;
		setDateRange(range);
		const newSearch = {
			...eventSearch,
			search: {
				...eventSearch.search,
				eventStartDay: range.startDate,
				eventEndDay: range.endDate,
			},
		};
		setEventSearch(newSearch);
		updateURL(newSearch);
	};

	const handlePageChange = (page: number) => {
		const newSearch = {
			...eventSearch,
			page,
		};
		setEventSearch(newSearch);
		updateURL(newSearch);
	};

	const handleSortChange = (value: string) => {
		const newSearch = {
			...eventSearch,
			sort: value as keyof Event,
		};
		setEventSearch(newSearch);
		updateURL(newSearch);
	};

	const toggleDirection = () => {
		const newSearch = {
			...eventSearch,
			direction: eventSearch.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		};
		setEventSearch(newSearch);
		updateURL(newSearch);
	};

	const handleClearAll = () => {
		setEventSearch(initialSearch);
		setSearchText('');
		setSelectedCategories([]);
		setDateRange({
			startDate: undefined,
			endDate: undefined,
			key: 'selection',
		});
		updateURL(initialSearch);
	};

	// Calculate total pages based on events length and limit
	const totalPages = Math.ceil(events.length / eventSearch.limit);
	const startPage = Math.max(1, eventSearch.page - 2);
	const endPage = Math.min(totalPages, startPage + 4);

	return (
		<div className="min-h-screen bg-background py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
					<div>
						<h1 className="text-4xl font-semibold tracking-tight text-foreground">Discover Events</h1>
						<p className="text-muted-foreground mt-2 text-lg">Find and join amazing events in your area</p>
					</div>
					<Link href="/events/create">
						<Button className="w-full md:w-auto bg-primary hover:bg-primary/90">Create Event</Button>
					</Link>
				</div>

				{/* Search and Filter Section */}
				<div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 p-6 mb-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex gap-2">
							<Input
								placeholder="Search events..."
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								className="flex-1 bg-background/50 backdrop-blur-sm"
							/>
							<Button onClick={handleSearch} className="shrink-0 bg-primary hover:bg-primary/90">
								<Search className="h-4 w-4 mr-2" />
								Search
							</Button>
						</div>

						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm"
								>
									<Calendar className="mr-2 h-4 w-4" />
									{formatDateRange(dateRange.startDate, dateRange.endDate)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<div className="flex flex-col gap-2 p-4">
									<div className="flex items-center justify-between">
										<h4 className="text-sm font-medium">Select Date Range</h4>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDateRangeChange({ selection: { startDate: undefined, endDate: undefined } })}
											className="text-muted-foreground"
										>
											Clear
										</Button>
									</div>
									<DateRange
										ranges={[dateRange]}
										onChange={handleDateRangeChange}
										moveRangeOnFirstSelection={false}
										months={2}
										direction="horizontal"
										preventSnapRefocus={true}
										calendarFocus="forwards"
										showDateDisplay={false}
										showPreview={false}
										showSelectionPreview={true}
										editableDateInputs={false}
										minDate={new Date()}
										className="rounded-xl border border-border/50"
									/>
								</div>
							</PopoverContent>
						</Popover>

						<div className="flex gap-2">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm"
									>
										<ArrowUpDown className="mr-2 h-4 w-4" />
										{sortOptions.find((option) => option.value === eventSearch.sort)?.label}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-48">
									<div className="space-y-2">
										{sortOptions.map((option) => (
											<Button
												key={option.value}
												variant="ghost"
												className="w-full justify-start"
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
								className="shrink-0 bg-background/50 backdrop-blur-sm"
							>
								{eventSearch.direction === Direction.ASC ? '↑' : '↓'}
							</Button>
						</div>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Categories Sidebar */}
					<div className="w-full md:w-64 shrink-0">
						<div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-medium">Categories</h3>
								<Button variant="ghost" size="sm" onClick={handleClearAll} className="text-muted-foreground">
									Clear All
								</Button>
							</div>
							<div className="space-y-3">
								{Object.values(EventCategory).map((category) => (
									<div key={category} className="flex items-center space-x-2">
										<Checkbox
											id={`sidebar-${category}`}
											checked={selectedCategories.includes(category)}
											onCheckedChange={() => handleCategoryChange(category)}
										/>
										<Label htmlFor={`sidebar-${category}`} className="text-sm cursor-pointer">
											{category}
										</Label>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Events Grid */}
					<div className="flex-1">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{events
								.slice((eventSearch.page - 1) * eventSearch.limit, eventSearch.page * eventSearch.limit)
								.map((event) => (
									<div key={event._id} className="group">
										<div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 overflow-hidden hover:shadow-md transition-all duration-300 group-hover:border-primary/50">
											<Link href={`/events/${event._id}`}>
												<div className="relative h-48">
													<img
														src={event.eventImage}
														alt={event.eventName}
														className="absolute inset-0 w-full h-full object-cover"
													/>
												</div>
											</Link>
											<div className="p-6">
												<div className="flex justify-between items-start mb-3 h-[2.5rem]">
													<h3 className="text-lg font-medium text-foreground line-clamp-1">{event.eventName}</h3>
												</div>
												<div className="h-[3.5rem] overflow-hidden">
													<p className="text-muted-foreground text-sm line-clamp-2">{event.eventDesc}</p>
												</div>
												<div className="space-y-2 mt-4">
													<div className="flex items-center text-sm text-muted-foreground">
														<MapPin className="w-4 h-4 mr-2" />
														{event.eventAddress}
													</div>
													<div className="flex items-center text-sm text-muted-foreground">
														<Calendar className="w-4 h-4 mr-2" />
														{new Date(event.eventDate).toLocaleDateString()}
													</div>
													<div className="flex items-center text-sm text-muted-foreground">
														<Users className="w-4 h-4 mr-2" />
														{event.eventCapacity - event.attendeeCount} tickets left
													</div>
												</div>
												<div className="mt-6 border-t border-border/50 pt-4 flex items-center justify-between">
													<Button
														variant={event.attendeeCount > 0 ? 'outline' : 'default'}
														className={event.attendeeCount > 0 ? 'text-muted-foreground' : ''}
														onClick={(e) => {
															e.preventDefault();
															// TODO: Add registration logic here
														}}
													>
														{event.attendeeCount > 0 ? 'Registered' : 'Register'}
													</Button>
													<span className="text-lg font-semibold text-primary">${event.eventPrice}</span>
												</div>
											</div>
										</div>
									</div>
								))}
						</div>

						{/* Pagination */}
						<div className="mt-8 flex justify-center">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() => handlePageChange(eventSearch.page - 1)}
											className={eventSearch.page <= 1 ? 'pointer-events-none opacity-50' : ''}
										/>
									</PaginationItem>

									{Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
										<PaginationItem key={page}>
											<PaginationLink isActive={eventSearch.page === page} onClick={() => handlePageChange(page)}>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}

									<PaginationItem>
										<PaginationNext
											onClick={() => handlePageChange(eventSearch.page + 1)}
											className={eventSearch.page >= totalPages ? 'pointer-events-none opacity-50' : ''}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(EventsPage);
