import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { EventCategory, EventStatus } from '../../libs/enums/event.enum';
import withBasicLayout from '../../libs/components/layout/LayoutBasic';
import { Event } from '../../libs/types/event/event';
import { EventsInquiry } from '../../libs/types/event/event.input';
import { Direction } from '../../libs/enums/common.enum';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import EventCard from '@/libs/components/events/EventCard';
import SortAndFilter from '@/libs/components/events/SortAndFilter';
import EventsHeader from '@/libs/components/events/EventsHeader';
import CategoriesSidebar from '@/libs/components/events/CategoriesSidebar';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '@/apollo/user/query';
import { userVar } from '@/apollo/store';
import { LIKE_TARGET_EVENT } from '@/apollo/user/mutation';
import PaginationComponent from '@/libs/components/common/PaginationComponent';
import { GetStaticProps } from 'next';
import { likeHandler } from '@/libs/utils';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale || 'en', ['common'])),
	},
});

interface EventsPageProps {
	initialSearch?: EventsInquiry;
}

const EventsPage = ({
	initialSearch = {
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
	},
}: EventsPageProps) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [events, setEvents] = useState<Event[]>([]);

	const readUrl = (): EventsInquiry => {
		if (router?.query) {
			const categories =
				(router.query.categories as string)
					?.split('-')
					.filter(Boolean)
					.map((cat) => cat.toUpperCase() as EventCategory)
					.filter((cat) => Object.values(EventCategory).includes(cat)) || [];

			// Safely parse dates
			const parseDate = (dateStr: string | undefined): Date | undefined => {
				if (!dateStr) return undefined;
				// Handle both YYYY-MM-DD and ISO string formats
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
	const [eventsSearchFilters, setEventsSearchFilters] = useState<EventsInquiry>(() => readUrl());

	const updateURL = (newSearch: EventsInquiry) => {
		const query: Record<string, string> = {
			page: Math.max(1, newSearch.page || 1).toString(),
			limit: Math.max(1, newSearch.limit || 6).toString(),
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
			query.startDate = newSearch.search.eventStartDay.toISOString().split('T')[0];
		}
		if (newSearch.search.eventEndDay) {
			query.endDate = newSearch.search.eventEndDay.toISOString().split('T')[0];
		}

		router.push({ query }, undefined, { shallow: true });
	};

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data: getEventsData, refetch: getEventsRefetch } = useQuery(GET_EVENTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: eventsSearchFilters,
		},
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES **/

	useEffect(() => {
		setEventsSearchFilters(readUrl());
	}, [router]);

	useEffect(() => {
		getEventsRefetch({ input: eventsSearchFilters }).then();
	}, [eventsSearchFilters]);

	useEffect(() => {
		if (getEventsData) {
			setEvents(getEventsData?.getEvents?.list);
			setTotalPages(Math.max(1, Math.ceil(getEventsData?.getEvents?.list.length / (eventsSearchFilters.limit || 6))));
		}
	}, [getEventsData]);

	/** HANDLERS */
	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			updateURL({ ...eventsSearchFilters, page });
		}
	};

	const likeEventHandler = async (eventId: string) => {
		await likeHandler(user._id, eventId, likeTargetEvent, t('Event liked successfully'));
	};

	return (
		<div>
			<EventsHeader />
			<SortAndFilter updateURL={updateURL} eventsSearchFilters={eventsSearchFilters} initialSearch={initialSearch} />

			<div className="max-w-7xl py-10 mx-auto mb-10">
				<div className="flex flex-row gap-8">
					{/* Categories Sidebar */}
					<CategoriesSidebar
						eventsSearchFilters={eventsSearchFilters}
						updateURL={updateURL}
						initialSearch={initialSearch}
					/>

					{/* Events Grid */}
					<div className="flex-1">
						{events.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{events.map((event) => (
										<EventCard key={event._id} event={event} likeEventHandler={likeEventHandler} />
									))}
								</div>

								{/* Pagination */}
								<div className="mt-8 flex justify-center">
									<PaginationComponent
										totalItems={totalPages}
										currentPage={eventsSearchFilters.page}
										setCurrentPage={handlePageChange}
										limit={eventsSearchFilters.limit}
									/>
								</div>
							</>
						) : (
							<div className="text-center py-12">
								<p className="text-muted-foreground">{t('No events found. Try adjusting your filters.')}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(EventsPage);
