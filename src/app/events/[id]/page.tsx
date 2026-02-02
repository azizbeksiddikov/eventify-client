"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";

import ChosenEventData from "@/libs/components/events/ChosenEventData";
import ChosenEventHeader from "@/libs/components/events/ChosenEventHeader";
import ChosenEventOther from "@/libs/components/events/ChosenEventOther";
import NotFound from "@/libs/components/common/NotFound";
import CommentsComponent from "@/libs/components/common/CommentsComponent";
import { CommentGroup } from "@/libs/enums/comment.enum";

import { GET_EVENT, GET_MY_TICKETS } from "@/apollo/user/query";
import { CREATE_TICKET, LIKE_TARGET_EVENT } from "@/apollo/user/mutation";
import { Event } from "@/libs/types/event/event";
import { smallSuccess, smallError } from "@/libs/alert";
import { likeEvent } from "@/libs/utils";
import MyTickets from "@/libs/components/events/MyTickets";
import { TicketInput, TicketInquiry } from "@/libs/types/ticket/ticket.input";
import { Tickets } from "@/libs/types/ticket/ticket";
import Loading from "@/libs/components/common/Loading";

const ChosenEvent = () => {
	const params = useParams();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation(["events", "errors"]);

	const eventId = params?.id as string | undefined;
	const [event, setEvent] = useState<Event | null>(null);
	const isExternalEvent = Boolean(event?.externalUrl) || (event?.origin ? event.origin !== "internal" : false);
	const [ticketInput, setTicketInput] = useState<TicketInput>({
		eventId: eventId ?? "",
		ticketQuantity: 1,
	});

	const [ticketInquiry, setTicketInquiry] = useState<TicketInquiry>({
		page: 1,
		limit: 5,
		search: {
			eventId: eventId ?? undefined,
			ticketStatus: undefined,
		},
	});
	const [myTickets, setMyTickets] = useState<Tickets>({
		list: [],
		metaCounter: [],
	});

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);
	const [createTicket] = useMutation(CREATE_TICKET);
	const {
		data: getEventData,
		loading: eventLoading,
		refetch: refetchEvent,
	} = useQuery(GET_EVENT, {
		fetchPolicy: "cache-and-network",
		skip: !eventId,
		variables: { input: eventId || "" },
		notifyOnNetworkStatusChange: true,
	});
	const { data: getTicketsData, refetch: refetchTickets } = useQuery(GET_MY_TICKETS, {
		fetchPolicy: "cache-and-network",
		skip: !ticketInquiry.search.eventId || !user._id || isExternalEvent,
		variables: { input: ticketInquiry },
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES */
	useEffect(() => {
		if (eventId) {
			setTicketInquiry({
				page: 1,
				limit: 5,
				search: {
					eventId: eventId,
				},
			});
		}
	}, [eventId]);

	useEffect(() => {
		if (getEventData?.getEvent) {
			const eventData = getEventData.getEvent;
			setEvent(eventData as Event);

			if (eventData._id) {
				setTicketInput({
					eventId: eventData._id,
					ticketQuantity: 1,
				});
			}
		}
	}, [getEventData]);

	useEffect(() => {
		if (getTicketsData?.getMyTickets) {
			setMyTickets(getTicketsData.getMyTickets);
		}
	}, [getTicketsData]);

	/**  HANDLERS */

	const likeEventHandler = async (eventId: string) => {
		await likeEvent(user._id, eventId, likeTargetEvent);
	};

	const purchaseTicketHandler = async () => {
		try {
			if (!user._id) throw new Error(t("errors:not_authenticated"));
			if (!eventId) throw new Error(t("event_not_found"));
			if (isExternalEvent) throw new Error(t("errors:invalid_request"));

			await createTicket({ variables: { input: ticketInput } });
			if (eventId) {
				refetchEvent({ input: eventId });
			}
			refetchTickets({ input: ticketInquiry });

			await smallSuccess(t("ticket_purchased_successfully"));
		} catch (error: unknown) {
			// Handle Apollo GraphQL errors
			const apolloError = error as { message?: string; graphQLErrors?: Array<{ message: string }> };
			const rawMessage = apolloError.graphQLErrors?.[0]?.message || apolloError.message || "";

			// Map known backend errors to translated messages
			let errorMessage: string;
			if (rawMessage.includes("do not have enough points")) {
				errorMessage = t("errors:insufficient_points");
			} else {
				errorMessage = rawMessage || t("errors:something_went_wrong");
			}
			smallError(errorMessage);
		}
	};

	if (!eventId) return null;

	return (
		<div>
			<ChosenEventHeader />

			<div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-10">
				{eventLoading && <Loading />}

				{!eventLoading && !event ? (
					<NotFound
						title={t("event_not_found")}
						message={t("event_not_found_message")}
						backPath="/events"
						backLabel={t("back_to_events")}
					/>
				) : null}

				{event && (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
						<div className="lg:col-span-3">
							<ChosenEventData
								event={event}
								userId={user._id}
								purchaseTicketHandler={purchaseTicketHandler}
								likeEventHandler={likeEventHandler}
								setTicketInput={setTicketInput}
								ticketInput={ticketInput}
							/>
							{/* My Tickets */}
							{!isExternalEvent && (
								<MyTickets myTickets={myTickets} ticketInquiry={ticketInquiry} setTicketInquiry={setTicketInquiry} />
							)}

							{/* Comments Section */}
							{!isExternalEvent && <CommentsComponent commentRefId={event._id} commentGroup={CommentGroup.EVENT} />}
						</div>

						<ChosenEventOther event={event} likeEventHandler={likeEventHandler} />
					</div>
				)}
			</div>
		</div>
	);
};

export default ChosenEvent;
