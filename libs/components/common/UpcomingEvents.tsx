import { useTranslation } from "next-i18next";
import { Calendar } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/libs/components/ui/carousel";
import { Card } from "@/libs/components/ui/card";
import { Badge } from "@/libs/components/ui/badge";
import EventCard from "@/libs/components/common/EventCard";

import { Event } from "@/libs/types/event/event";

interface UpcomingEventsProps {
	events: Event[];
	organizerName?: string;
	likeEventHandler: (eventId: string) => Promise<void>;
}

const UpcomingEvents = ({ events, organizerName, likeEventHandler }: UpcomingEventsProps) => {
	const { t } = useTranslation(["home", "events", "groups"]);

	const title = (
		<div className="space-y-1">
			<div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-card-foreground">
				<Calendar className="w-6 h-6 text-primary" />
				<span>{t("upcoming_events")}</span>
			</div>
			{organizerName && (
				<div className="flex items-center gap-1.5 text-sm sm:text-base text-muted-foreground ml-8">
					<span>{t("by")}</span>
					<span className="text-primary font-medium truncate max-w-[200px] sm:max-w-md">{organizerName}</span>
					{events.length > 0 && (
						<Badge
							variant="secondary"
							className="hidden sm:inline-flex ml-3 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 transition-colors px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider"
						>
							{events.length} {t("events_this_month")}
						</Badge>
					)}
				</div>
			)}
		</div>
	);

	if (events.length === 0) {
		return (
			<Card className="mt-10 p-6 sm:p-8 bg-card hover:bg-accent/5 transition-all duration-300 shadow-sm hover:shadow-md border  /50 text-center">
				{title}
				<p className="mt-4 text-muted-foreground">{t("no_events_scheduled_next_30_days")}</p>
			</Card>
		);
	}

	return (
		<Card className="mt-10 p-5 sm:p-8 bg-card border shadow-sm rounded-2xl">
			{title}
			<div className="mt-8">
				<Carousel
					opts={{
						align: "start",
						loop: false,
					}}
					className="w-full"
				>
					<CarouselContent className="-ml-2 md:-ml-4">
						{events.map((event) => (
							<CarouselItem key={event._id} className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3">
								<div className="h-full">
									<EventCard event={event} likeEventHandler={likeEventHandler} />
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="hidden md:flex items-center justify-end gap-3 mt-6">
						<CarouselPrevious />
						<CarouselNext />
					</div>
				</Carousel>
			</div>
		</Card>
	);
};

export default UpcomingEvents;
