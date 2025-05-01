import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { EventCategory, EventStatus } from '../../libs/enums/event.enum';
import withBasicLayout from '../../libs/components/layout/LayoutBasic';
import { Event } from '../../libs/types/event/event';
import { EventsInquiry } from '../../libs/types/event/event.input';
import { Direction } from '../../libs/enums/common.enum';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/libs/components/ui/pagination';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { eventList as events } from '@/data';
import EventCard from '@/libs/components/events/EventCard';
import SortAndFilter from '@/libs/components/events/SortAndFilter';
import EventsHeader from '@/libs/components/events/EventsHeader';
import CategoriesSidebar from '@/libs/components/events/CategoriesSidebar';

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

	const readUrl = (): EventsInquiry => {
		if (router?.query) {
			console.log(router.query);
			const categories =
				(router.query.categories as string)
					?.split('-')
					.filter(Boolean)
					.map((cat) => cat.toUpperCase() as EventCategory)
					.filter((cat) => Object.values(EventCategory).includes(cat)) || [];

			// Safely parse dates
			const parseDate = (dateStr: string | undefined): Date | undefined => {
				if (!dateStr) return undefined;
				const date = new Date(dateStr);
				return isNaN(date.getTime()) ? undefined : date;
			};

			return {
				page: Math.max(1, Number(router.query.page) || 1),
				limit: Math.max(1, Number(router.query.limit) || 6),
				sort: (router.query.sort as keyof Event) || 'createdAt',
				direction: router.query.direction === '1' ? Direction.ASC : Direction.DESC,
				search: {
					text: (router.query.text as string) || '',
					eventCategories: categories,
					eventStatus: router.query.status as EventStatus,
					eventStartDay: parseDate(router.query.startDate as string),
					eventEndDay: parseDate(router.query.endDate as string),
				},
			};
		}
		return initialSearch;
	};

	const [eventSearch, setEventSearch] = useState<EventsInquiry>(() => readUrl());

	const updateURL = (newSearch: EventsInquiry) => {
		const query: Record<string, string> = {
			page: Math.max(1, newSearch.page).toString(),
			limit: Math.max(1, newSearch.limit).toString(),
			sort: newSearch.sort || 'createdAt',
			direction: newSearch.direction === Direction.ASC ? '1' : '-1',
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

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			updateURL({ ...eventSearch, page });
		}
	};

	useEffect(() => {
		const search = readUrl();
		setEventSearch(search);
	}, [router]);

	// Calculate total pages based on events length and limit
	const totalPages = Math.max(1, Math.ceil(events.length / eventSearch.limit));
	const startPage = Math.max(1, Math.min(eventSearch.page - 2, totalPages - 4));
	const endPage = Math.min(totalPages, startPage + 4);

	return (
		<div>
			<EventsHeader />
			<SortAndFilter updateURL={updateURL} eventSearch={eventSearch} />

			<div className="max-w-7xl py-10 mx-auto mb-10">
				<div className="flex flex-row gap-8">
					{/* Categories Sidebar */}
					<CategoriesSidebar eventSearch={eventSearch} updateURL={updateURL} initialSearch={initialSearch} />

					{/* Events Grid */}
					<div className="flex-1">
						{events.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{events
										.slice((eventSearch.page - 1) * eventSearch.limit, eventSearch.page * eventSearch.limit)
										.map((event) => (
											<EventCard key={event._id} event={event} />
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
							</>
						) : (
							<div className="text-center py-12">
								<p className="text-muted-foreground">No events found. Try adjusting your filters.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(EventsPage);
