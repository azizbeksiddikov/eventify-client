import { useTranslation } from "next-i18next";
import { Calendar } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/libs/components/ui/carousel";
import { Card } from "@/libs/components/ui/card";
import EventCard from "@/libs/components/common/EventCard";

import { Event } from "@/libs/types/event/event";

interface UpcomingEventsProps {
	events: Event[];
	organizerName?: string;
	likeEventHandler: (eventId: string) => Promise<void>;
}

const UpcomingEvents = ({ events, organizerName, likeEventHandler }: UpcomingEventsProps) => {
	const { t } = useTranslation("common");

	const title = (
		<div className="flex flex-wrap items-center gap-2 text-xl sm:text-2xl font-semibold text-card-foreground">
			<Calendar className="w-5 h-5 text-card-foreground" />
			<span>{t("Upcoming Events")}</span>
			{organizerName && (
				<>
					<span>{t("by")}</span>
					<span className="text-primary truncate">{organizerName}</span>
				</>
			)}
			{events.length > 0 && (
				<span className="text-muted-foreground text-base">
					({events.length}) {t("in a month")}
				</span>
			)}
		</div>
	);

	if (events.length === 0) {
		return (
			<Card className="mt-10 p-6 sm:p-8 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-md border  /50 text-center">
				{title}
				<p className="mt-4 text-muted-foreground">{t("No events scheduled in the next 30 days.")}</p>
			</Card>
		);
	}

	return (
		<Card className="mt-10 p-6 sm:p-8 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-md border  /50">
			{title}
			<div className="mt-6">
				<Carousel opts={{ align: "start" }} className="w-full">
					<CarouselContent className="px-1 sm:px-4">
						{events.map((event) => (
							<CarouselItem key={event._id} className="basis-[90%] sm:basis-1/2 lg:basis-1/3">
								<div className="p-2">
									<EventCard event={event} likeEventHandler={likeEventHandler} />
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="hidden sm:flex items-center justify-between px-4 mt-4">
						<CarouselPrevious />
						<CarouselNext />
					</div>
				</Carousel>
			</div>
		</Card>
	);
};

export default UpcomingEvents;
