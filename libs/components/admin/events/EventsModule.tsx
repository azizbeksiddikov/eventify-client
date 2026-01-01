import { useRef } from "react";
import { useTranslation } from "next-i18next";

import { Separator } from "@/libs/components/ui/separator";
import PaginationComponent from "@/libs/components/common/PaginationComponent";

import { EventUpdateInput } from "@/libs/types/event/event.update";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { Events } from "@/libs/types/event/event";
import { EventSearch } from "./EventSearch";
import { EventPanelList } from "./EventList";

interface EventsInquiryProps {
	events: Events;
	initialInquiry: EventsInquiry;
	eventsInquiry: EventsInquiry;
	setEventsInquiry: (eventsInquiry: EventsInquiry) => void;
	updateEventHandler: (event: EventUpdateInput) => Promise<void>;
	removeEventHandler: (eventId: string) => Promise<void>;
}

const EventsModule = ({
	events,
	initialInquiry,
	eventsInquiry,
	setEventsInquiry,
	updateEventHandler,
	removeEventHandler,
}: EventsInquiryProps) => {
	const { t } = useTranslation("admin");
	const eventsTotal = events.metaCounter[0]?.total ?? 0;
	const eventsListRef = useRef<HTMLDivElement>(null);

	/** HANDLERS **/

	const pageChangeHandler = (newPage: number) => {
		setEventsInquiry({ ...eventsInquiry, page: newPage });
		if (eventsListRef.current) {
			const header = document.querySelector("header");
			const headerHeight = header ? header.offsetHeight : 80;
			const extraSpacing = 32; // 32px
			const elementPosition = eventsListRef.current.getBoundingClientRect().top + window.pageYOffset;
			const scrollTop = Math.max(0, elementPosition - headerHeight - extraSpacing);
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">{t("event_list")}</h2>
			<div className="bg-card rounded-lg shadow border  ">
				<EventSearch
					initialInquiry={initialInquiry}
					eventsInquiry={eventsInquiry}
					setEventsInquiry={setEventsInquiry}
				/>
				<Separator className="bg-border" />
				<div className="p-4 my-4 gap-4 flex flex-col">
					<div ref={eventsListRef}>
						<EventPanelList
							events={events}
							updateEventHandler={updateEventHandler}
							removeEventHandler={removeEventHandler}
						/>
					</div>
					<PaginationComponent
						totalItems={eventsTotal ?? 0}
						currentPage={eventsInquiry.page}
						limit={eventsInquiry.limit}
						pageChangeHandler={pageChangeHandler}
					/>
				</div>
			</div>
		</div>
	);
};

export default EventsModule;
