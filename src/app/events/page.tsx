"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { userVar } from "@/apollo/store";
import { useTranslation } from "next-i18next";
import { useMutation, useReactiveVar } from "@apollo/client/react";
import { useQuery } from "@apollo/client/react";

import PaginationComponent from "@/libs/components/common/PaginationComponent";
import EventCard from "@/libs/components/common/EventCard";
import SortAndFilter from "@/libs/components/events/SortAndFilter";
import EventsHeader from "@/libs/components/events/EventsHeader";
import CategoriesSidebar from "@/libs/components/events/CategoriesSidebar";

import { GET_EVENTS } from "@/apollo/user/query";
import { LIKE_TARGET_EVENT } from "@/apollo/user/mutation";
import { likeEvent, parseDate, readDate } from "@/libs/utils";
import { EventCategory, EventStatus } from "@/libs/enums/event.enum";
import { Event } from "@/libs/types/event/event";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { Direction } from "@/libs/enums/common.enum";
import Loading from "@/libs/components/common/Loading";

interface EventsPageProps {
	initialSearch?: EventsInquiry;
}

const EventsPage = ({
	initialSearch = {
		page: 1,
		limit: 6,
		sort: "eventStartAt",
		direction: Direction.ASC,
		search: {
			text: "",
			eventCategories: [],
			eventStatus: EventStatus.UPCOMING,
			eventStartDay: new Date(),
			eventEndDay: undefined,
		},
	},
}: EventsPageProps) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const { t } = useTranslation("events");
	const user = useReactiveVar(userVar);
	const [events, setEvents] = useState<Event[]>([]);

	const readUrl = (): EventsInquiry => {
		if (searchParams) {
			const categories =
				searchParams
					.get("categories")
					?.split("-")
					.filter(Boolean)
					.map((cat) => cat.toUpperCase() as EventCategory)
					.filter((cat) => Object.values(EventCategory).includes(cat)) || [];

			const startDate = searchParams.get("startDate");
			const endDate = searchParams.get("endDate");
			const statusParam = searchParams.get("status");

			// Parse dates and validate
			const parsedStartDate = parseDate(startDate || undefined);
			let parsedEndDate = parseDate(endDate || undefined);

			// Validate: startDate must be ≤ endDate
			if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
				// If startDate is after endDate, clear endDate (similar to SearchEvents behavior)
				parsedEndDate = undefined;
			}

			// If dates are present (from SearchEvents), allow any event status
			// Otherwise, if no status is specified, default to UPCOMING
			let eventStatus: EventStatus | undefined;
			if (parsedStartDate || parsedEndDate) {
				// From SearchEvents: allow any status, only use status if explicitly provided
				eventStatus = statusParam ? (statusParam as EventStatus) : undefined;
			} else {
				// No dates: default to UPCOMING if no status specified
				eventStatus = (statusParam as EventStatus) || EventStatus.UPCOMING;
			}

			return {
				page: Math.max(1, Number(searchParams.get("page")) || 1),
				limit: Math.max(1, Number(searchParams.get("limit")) || 6),
				sort: (searchParams.get("sort") as keyof Event) || "eventStartAt",
				direction: searchParams.get("direction") === "-1" ? Direction.DESC : Direction.ASC,
				search: {
					text: searchParams.get("text") || "",
					eventCategories: categories,
					eventStatus,
					eventStartDay: parsedStartDate,
					eventEndDay: parsedEndDate,
				},
			};
		}
		return initialSearch;
	};
	const [eventsSearchFilters, setEventsSearchFilters] = useState<EventsInquiry>(() => readUrl());

	const updateURL = (newSearch: EventsInquiry) => {
		const params = new URLSearchParams();

		params.set("page", Math.max(1, newSearch.page || 1).toString());
		params.set("limit", Math.max(1, newSearch.limit || 6).toString());
		params.set("sort", newSearch.sort || "eventStartAt");
		params.set("direction", newSearch.direction === Direction.ASC ? "1" : "-1");

		if (newSearch.search.text) {
			params.set("text", newSearch.search.text);
		}
		if (newSearch.search.eventCategories?.length) {
			params.set("categories", newSearch.search.eventCategories.join("-"));
		}
		if (newSearch.search.eventStatus) {
			params.set("status", newSearch.search.eventStatus);
		}
		if (newSearch.search.eventStartDay) {
			params.set("startDate", `${readDate(newSearch.search.eventStartDay)}`);
		}
		if (newSearch.search.eventEndDay) {
			params.set("endDate", `${readDate(newSearch.search.eventEndDay)}`);
		}

		router.push(`${pathname}?${params.toString()}`);
	};

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const {
		data: getEventsData,
		loading: eventsLoading,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: "cache-and-network",
		variables: {
			input: eventsSearchFilters,
		},
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES **/

	useEffect(() => {
		setEventsSearchFilters(readUrl());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	useEffect(() => {
		getEventsRefetch({ input: eventsSearchFilters }).then();
	}, [eventsSearchFilters, getEventsRefetch]);

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
		await likeEvent(user._id, eventId, likeTargetEvent);
	};

	return (
		<div>
			<EventsHeader />
			<div className="px-6 sm:px-12 lg:px-20">
				<SortAndFilter updateURL={updateURL} eventsSearchFilters={eventsSearchFilters} initialSearch={initialSearch} />
			</div>

			<div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-10 mb-10">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Categories Sidebar */}
					<CategoriesSidebar
						eventsSearchFilters={eventsSearchFilters}
						updateURL={updateURL}
						initialSearch={initialSearch}
					/>

					{/* Events Grid */}
					<div className="flex-1">
						{eventsLoading && events.length === 0 ? (
							<Loading />
						) : events.length > 0 ? (
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
								<p className="text-muted-foreground">{t("no_events_found")}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventsPage;
