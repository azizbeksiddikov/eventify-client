import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Heart, Calendar, Users, ExternalLink, MapPin, Eye, DollarSign, UserPlus } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/libs/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";
import { Badge } from "@/libs/components/ui/badge";

import { Event } from "@/libs/types/event/event";
import { EventStatus } from "@/libs/enums/event.enum";

import { getImageUrl, formatSeoulDate, formatSeoulTime } from "@/libs/utils";

interface EventCardProps {
	event: Event;
	likeEventHandler: (eventId: string) => Promise<void>;
}

const EventCard = ({ event, likeEventHandler }: EventCardProps) => {
	const { t } = useTranslation("common");

	const getStatusColor = (status: EventStatus) => {
		switch (status) {
			case EventStatus.UPCOMING:
				return "bg-blue-100 text-blue-800";
			case EventStatus.ONGOING:
				return "bg-green-100 text-green-800";
			case EventStatus.COMPLETED:
				return "bg-gray-100 text-gray-800";
			case EventStatus.CANCELLED:
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<Card className="pt-0  w-full h-full mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-card/60 flex flex-col group gap-0">
			<CardHeader className="p-0 gap-0">
				<div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
					<Link href={`/events/${event._id}`}>
						<Image
							src={getImageUrl(event.eventImages[0], "event", event.origin)}
							alt={event.eventName}
							fill
							className="object-cover transition-transform duration-300"
						/>
					</Link>
					<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
							<Eye className="w-4 h-4 mr-1.5" />
							{event.eventViews || 0}
						</Badge>
					</div>
					<div className="absolute bottom-3 left-3">
						<Badge variant="secondary" className={`${getStatusColor(event.eventStatus)} backdrop-blur-sm shadow-sm`}>
							{event.eventStatus}
						</Badge>
					</div>
					<div className="absolute bottom-3 right-3">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
							<DollarSign className="w-4 h-4 mr-1.5" />
							{event.eventPrice}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3 p-3 flex-1 flex flex-col">
				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-foreground line-clamp-1 h-6">{event.eventName}</h3>

					<div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
						{event.eventCategories?.map((category, index) => (
							<span
								key={index}
								className="truncate text-xs text-primary/90 bg-primary/10 px-1.5 sm:px-2 py-0.5 rounded-full"
								title={`#${category}`}
							>
								#{category}
							</span>
						))}
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center gap-2 text-sm text-muted-foreground h-5">
							<MapPin className="w-4 h-4 shrink-0" />
							<span className="line-clamp-1">{event.eventCity || event.eventAddress}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-muted-foreground h-5">
							<Calendar className="w-4 h-4 shrink-0" />
							<span>
								{formatSeoulDate(event.eventStartAt, { month: "short", day: "numeric" })} •{" "}
								{formatSeoulTime(event.eventStartAt)} - {formatSeoulTime(event.eventEndAt)}
							</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-1.5 p-2 bg-muted/50 rounded-lg mt-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1.5 p-1.5 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Users className="h-3.5 w-3.5 text-primary" />
								<p className="text-xs font-medium">{event.attendeeCount || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t("Total attendees")}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1.5 p-1.5 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<UserPlus className="h-3.5 w-3.5 text-primary" />
								<p className="text-xs font-medium">{event.eventCapacity || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t("Event capacity")}</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center justify-center gap-1.5 p-1.5 rounded-md bg-card/70 hover:bg-card transition-colors cursor-help">
								<Heart className="h-3.5 w-3.5 text-primary" />
								<p className="text-xs font-medium">{event.eventLikes || 0}</p>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">{t("Total likes received")}</TooltipContent>
					</Tooltip>
				</div>

				<div className="px-0.5 mt-1">
					<div className="relative">
						<div className="bg-muted/30 p-2 rounded-lg min-h-[48px] flex items-center">
							{event.eventDesc ? (
								<p className="text-xs text-foreground leading-relaxed line-clamp-2">{event.eventDesc}</p>
							) : (
								<p className="text-xs text-muted-foreground italic flex items-center justify-center py-1 w-full">
									<span className="bg-muted/50 px-2 py-0.5 rounded-md">{t("No description available")}</span>
								</p>
							)}
						</div>
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t flex items-center justify-between gap-2 py-0 my-0">
				<Button
					variant="ghost"
					size="sm"
					className={`h-8 w-8 p-0 transition-all ${event?.meLiked?.[0]?.myFavorite ? "text-rose-500" : ""}`}
					onClick={() => likeEventHandler(event._id)}
					aria-label={event?.meLiked?.[0]?.myFavorite ? t("Liked") : t("Like")}
				>
					<Heart
						className={`h-4 w-4 transition-all ${event?.meLiked?.[0]?.myFavorite ? "fill-current stroke-current" : ""}`}
					/>
				</Button>

				<Link href={`/events/${event._id}`}>
					<Button
						variant="outline"
						size="sm"
						className="h-8 rounded-lg hover:bg-primary/5 border-primary/30 text-primary transition-colors"
					>
						<ExternalLink className="h-3.5 w-3.5 mr-1" />
						{t("View")}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default EventCard;
