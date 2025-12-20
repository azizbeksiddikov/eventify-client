"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";

import CommentsComponent from "@/libs/components/common/CommentsComponent";
import { CommentGroup } from "@/libs/enums/comment.enum";
import ChosenEventData from "@/libs/components/events/ChosenEventData";
import ChosenEventHeader from "@/libs/components/events/ChosenEventHeader";
import ChosenEventOther from "@/libs/components/events/ChosenEventOther";

import { GET_EVENT, GET_MY_TICKETS } from "@/apollo/user/query";
import { CREATE_TICKET, LIKE_TARGET_EVENT } from "@/apollo/user/mutation";
import { Event } from "@/libs/types/event/event";
import { Message } from "@/libs/enums/common.enum";
import { smallSuccess } from "@/libs/alert";
import { likeEvent } from "@/libs/utils";
import MyTickets from "@/libs/components/events/MyTickets";
import { TicketInput, TicketInquiry } from "@/libs/types/ticket/ticket.input";
import { Tickets } from "@/libs/types/ticket/ticket";

const ChosenEvent = () => {
	const params = useParams();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation("common");

	const eventId = params?.id as string | undefined;
	const [event, setEvent] = useState<Event | null>(null);
	const isExternalEvent = Boolean(event?.externalUrl) || (event?.origin ? event.origin !== "internal" : false);
	const [ticketInput, setTicketInput] = useState<TicketInput>({
		eventId: eventId ?? "",
		ticketPrice: 0,
		ticketQuantity: 0,
		totalPrice: 0,
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

			if (eventData._id && eventData.eventPrice !== undefined) {
				setTicketInput({
					eventId: eventData._id,
					ticketPrice: eventData.eventPrice,
					ticketQuantity: 1,
					totalPrice: eventData.eventPrice,
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
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!eventId) throw new Error(Message.EVENT_NOT_FOUND);
			if (isExternalEvent) throw new Error(Message.BAD_REQUEST);

			await createTicket({ variables: { input: ticketInput } });
			if (eventId) {
				refetchEvent({ input: eventId });
			}
			refetchTickets({ input: ticketInquiry });

			await smallSuccess(t("Ticket purchased successfully"));
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			console.log("ERROR, purchaseTicketHandler:", errorMessage);
		}
	};

	if (!eventId) return null;

	return (
		<div>
			<ChosenEventHeader />

			<div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-10">
				{eventLoading && !event ? (
					<div className="rounded-xl border bg-card/60 shadow-sm p-6 animate-pulse">
						<div className="h-6 w-48 bg-muted/60 rounded mb-4" />
						<div className="h-40 w-full bg-muted/60 rounded mb-4" />
						<div className="h-4 w-full bg-muted/60 rounded mb-2" />
						<div className="h-4 w-5/6 bg-muted/60 rounded" />
					</div>
				) : null}

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
					</div>

					<ChosenEventOther event={event} likeEventHandler={likeEventHandler} />
				</div>

				{/* Comments Section */}
				{eventId && !isExternalEvent && <CommentsComponent commentRefId={eventId} commentGroup={CommentGroup.EVENT} />}
			</div>
		</div>
	);
};

export default ChosenEvent;
