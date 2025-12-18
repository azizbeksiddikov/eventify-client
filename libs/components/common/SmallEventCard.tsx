"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Heart, Eye } from "lucide-react";
import { Button } from "@/libs/components/ui/button";
import type { Event } from "@/libs/types/event/event";
import { getImageUrl, formatSeoulDate } from "@/libs/utils";

interface EventCardProps {
	event: Event;
	likeEventHandler: (eventId: string) => void;
}

const SmallEventCard = ({ event, likeEventHandler }: EventCardProps) => {
	const locationText =
		event.locationType === "ONLINE"
			? "Online"
			: [event.eventCity, event.eventAddress].filter(Boolean).join(" • ") ||
				event.eventCity ||
				event.eventAddress ||
				"";

	return (
		<div className="p-1.5 rounded-md hover:bg-accent/5 transition-all duration-200">
			<div className="flex items-center gap-2">
				{/* Image and Description Column */}
				<Link href={`/events/${event._id}`} className="flex-1 flex items-center gap-2 group">
					{/* Image */}
					<div className="shrink-0">
						<div className="w-12 h-12 rounded-md overflow-hidden relative">
							<Image
								src={getImageUrl(event.eventImages[0], "event", event.origin)}
								alt={event.eventName}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
								width={48}
								height={48}
							/>
							<div className="absolute inset-0 bg-linear-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
						</div>
					</div>

					{/* Description */}
					<div className="flex-1 min-w-0">
						<h4 className="text-xs sm:text-sm font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200 line-clamp-1">
							{event.eventName}
						</h4>
						<div className="mt-0.5 flex flex-col gap-0.5 text-[10px] text-card-foreground/70">
							<div className="flex items-center">
								<Calendar className="w-2.5 h-2.5 mr-0.5 text-card-foreground/70 shrink-0" />
								{formatSeoulDate(event.eventStartAt, {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</div>
							<div className="flex items-center">
								<MapPin className="w-2.5 h-2.5 mr-0.5 text-card-foreground/70 shrink-0" />
								<span className="line-clamp-1">{locationText}</span>
							</div>
						</div>
					</div>
				</Link>

				{/* Views and Like Column */}
				<div className="flex flex-col items-end gap-1">
					<div className="flex items-center">
						<Eye className="w-2.5 h-2.5 mr-0.5 text-card-foreground/70 shrink-0" />
						<span className="text-[10px] text-card-foreground/70">{event.eventViews.toLocaleString()}</span>
					</div>
					<Button
						variant="ghost"
						onClick={() => likeEventHandler(event?._id)}
						className="h-5 w-5 p-0 text-card-foreground/70 hover:text-primary transition-colors duration-200 hover:bg-primary/10 flex items-center justify-center"
						aria-label={event?.meLiked?.[0]?.myFavorite ? "Liked" : "Like"}
					>
						<Heart
							className={`w-2.5 h-2.5 transition-all duration-200 ${
								event?.meLiked?.[0]?.myFavorite ? "fill-primary text-primary" : ""
							}`}
						/>
					</Button>
				</div>
			</div>
		</div>
	);
};
export default SmallEventCard;
