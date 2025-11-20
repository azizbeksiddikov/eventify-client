import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userVar } from "@/apollo/store";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMutation, useReactiveVar, useApolloClient } from "@apollo/client";
import { useQuery } from "@apollo/client";

import withBasicLayout from "@/libs/components/layout/LayoutBasic";
import PaginationComponent from "@/libs/components/common/PaginationComponent";
import EventCard from "@/libs/components/common/EventCard";
import SortAndFilter from "@/libs/components/events/SortAndFilter";
import EventsHeader from "@/libs/components/events/EventsHeader";
import CategoriesSidebar from "@/libs/components/events/CategoriesSidebar";

import { GET_EVENTS } from "@/apollo/user/query";
import { LIKE_TARGET_EVENT } from "@/apollo/user/mutation";
import { likeEvent, parseDate } from "@/libs/utils";
import { EventCategory, EventStatus } from "@/libs/enums/event.enum";
import { Event } from "@/libs/types/event/event";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { Direction } from "@/libs/enums/common.enum";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale || "en", ["common"])),
	},
});

interface EventsPageProps {
	initialSearch?: EventsInquiry;
}

const EventsPage = ({
	initialSearch = {
		page: 1,
		limit: 6,
		sort: "createdAt",
		direction: Direction.DESC,
		search: {
			text: "",
			eventCategories: [],
			eventStatus: undefined,
			eventStartDay: undefined,
			eventEndDay: undefined,
		},
	},
}: EventsPageProps) => {
	const router = useRouter();
	const { t } = useTranslation("common");
	const user = useReactiveVar(userVar);
	const [events, setEvents] = useState<Event[]>([]);

	const readDate = (date: Date): string => {
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
			.getDate()
			.toString()
			.padStart(2, "0")}`;
	};

	const readUrl = (): EventsInquiry => {
		if (router?.query) {
			const categories =
				(router.query.categories as string)
					?.split("-")
					.filter(Boolean)
					.map((cat) => cat.toUpperCase() as EventCategory)
					.filter((cat) => Object.values(EventCategory).includes(cat)) || [];

			return {
				page: Math.max(1, Number(router.query.page) || 1),
				limit: Math.max(1, Number(router.query.limit) || 6),
				sort: (router.query.sort as keyof Event) || "createdAt",
				direction: router.query.direction === "1" ? Direction.ASC : Direction.DESC,
				search: {
					text: (router.query.text as string) || "",
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
			sort: newSearch.sort || "createdAt",
			direction: newSearch.direction === Direction.ASC ? "1" : "-1",
		};

		if (newSearch.search.text) {
			query.text = newSearch.search.text;
		}
		if (newSearch.search.eventCategories?.length) {
			query.categories = newSearch.search.eventCategories.join("-");
		}
		if (newSearch.search.eventStatus) {
			query.status = newSearch.search.eventStatus;
		}
		if (newSearch.search.eventStartDay) {
			query.startDate = `${readDate(newSearch.search.eventStartDay)}`;
		}
		if (newSearch.search.eventEndDay) {
			query.endDate = `${readDate(newSearch.search.eventEndDay)}`;
		}

		router.push({ query }, undefined, { shallow: true });
	};

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data: getEventsData, refetch: getEventsRefetch } = useQuery(GET_EVENTS, {
		fetchPolicy: "cache-and-network",
		variables: {
			input: eventsSearchFilters,
		},
		notifyOnNetworkStatusChange: true,
	});
	const client = useApolloClient();

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
		}
	}, [getEventsData]);

	/** HANDLERS */
	const pageChangeHandler = (newPage: number) => {
		setEventsSearchFilters({ ...eventsSearchFilters, page: newPage });
	};

	const likeEventHandler = async (eventId: string) => {
		await likeEvent(user._id, eventId, likeTargetEvent, client.cache);
	};

	return (
		<div>
			<EventsHeader />
			<SortAndFilter updateURL={updateURL} eventsSearchFilters={eventsSearchFilters} initialSearch={initialSearch} />

			<div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-10">
				<div className="flex flex-col lg:flex-row gap-8">
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
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{events.map((event) => (
										<EventCard key={event._id} event={event} likeEventHandler={likeEventHandler} />
									))}
								</div>

								{/* Pagination */}
								<div className="mt-10 flex justify-center">
									<PaginationComponent
										totalItems={getEventsData?.getEvents?.metaCounter?.[0]?.total ?? 0}
										currentPage={eventsSearchFilters.page}
										pageChangeHandler={pageChangeHandler}
										limit={eventsSearchFilters.limit}
									/>
								</div>
							</>
						) : (
							<div className="py-16 text-center">
								<p className="text-muted-foreground">{t("No events found. Try adjusting your filters.")}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(EventsPage);
