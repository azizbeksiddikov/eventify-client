import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { useMutation, useQuery, useReactiveVar, useApolloClient } from "@apollo/client";

import withBasicLayout from "@/libs/components/layout/LayoutBasic";
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

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ["common"])),
	},
});

const ChosenEvent = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation("common");

	const [eventId, setEventId] = useState<string | null>(null);
	const [event, setEvent] = useState<Event | null>(null);
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
	const { data: getEventData, refetch: refetchEvent } = useQuery(GET_EVENT, {
		fetchPolicy: "cache-and-network",
		skip: !eventId,
		variables: { input: eventId },
		notifyOnNetworkStatusChange: true,
	});
	const { data: getTicketsData, refetch: refetchTickets } = useQuery(GET_MY_TICKETS, {
		fetchPolicy: "cache-and-network",
		skip: !ticketInquiry.search.eventId || !user._id,
		variables: { input: ticketInquiry },
		notifyOnNetworkStatusChange: true,
	});

	const client = useApolloClient();

	/** LIFECYCLES */
	useEffect(() => {
		if (router.query.eventId) {
			setEventId(router.query.eventId as string);
			setTicketInquiry({
				page: 1,
				limit: 5,
				search: {
					eventId: router.query.eventId as string,
				},
			});
		}
	}, [router]);

	useEffect(() => {
		if (getEventData?.getEvent) {
			setEvent(getEventData.getEvent);

			setTicketInput({
				eventId: getEventData.getEvent._id,
				ticketPrice: getEventData.getEvent.eventPrice,
				ticketQuantity: 1,
				totalPrice: getEventData.getEvent.eventPrice,
			});
		}
	}, [getEventData]);

	useEffect(() => {
		if (getTicketsData?.getMyTickets) {
			setMyTickets(getTicketsData.getMyTickets);
		}
	}, [getTicketsData]);

	/**  HANDLERS */

	const likeEventHandler = async (eventId: string) => {
		await likeEvent(user._id, eventId, likeTargetEvent, client.cache);
	};

	const purchaseTicketHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!eventId) throw new Error(Message.EVENT_NOT_FOUND);

			await createTicket({ variables: { input: ticketInput } });
			refetchEvent({ input: eventId });
			refetchTickets({ input: ticketInquiry });

			await smallSuccess(t("Ticket purchased successfully"));
		} catch (error: any) {
			console.log("ERROR, purchaseTicketHandler:", error.message);
		}
	};

	if (!eventId) return null;

	return (
		<div className="mx-4">
			<ChosenEventHeader />

			<div className="max-w-7xl mx-auto pb-10">
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
						<MyTickets myTickets={myTickets} ticketInquiry={ticketInquiry} setTicketInquiry={setTicketInquiry} />
					</div>

					<ChosenEventOther event={event} likeEventHandler={likeEventHandler} />
				</div>

				{/* Comments Section */}
				{eventId && <CommentsComponent commentRefId={eventId} commentGroup={CommentGroup.EVENT} />}
			</div>
		</div>
	);
};

export default withBasicLayout(ChosenEvent);
