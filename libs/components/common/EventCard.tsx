import { SafeImage } from "@/libs/components/common/SafeImage";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import ReactMarkdown from "react-markdown";
import { Heart, Calendar, Users, ExternalLink, MapPin } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/libs/components/ui/card";
import { Badge } from "@/libs/components/ui/badge";

import { Event } from "@/libs/types/event/event";
import { EventStatus } from "@/libs/enums/event.enum";

import { getImageUrl, formatPrice } from "@/libs/utils";
import { formatEventRangeShort } from "@/libs/eventDates";

interface EventCardProps {
	event: Event;
	likeEventHandler: (eventId: string) => Promise<void>;
}

const EventCard = ({ event, likeEventHandler }: EventCardProps) => {
	const { t, i18n } = useTranslation("events");

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
		<Card className="w-full h-full mx-auto py-0 ui-card group gap-0">
			<CardHeader className="p-0 gap-0">
				<div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
					<SafeImage
						src={getImageUrl(event.eventImages[0], "event", event.origin)}
						fallbackType="event"
						alt={event.eventName}
						fill
						className="object-cover transition-transform duration-300"
					/>
					<Link href={`/events/${event._id}`} aria-label={event.eventName} className="absolute inset-0 z-1" />
					{event.isRealEvent === false && (
						<div className="absolute top-2 left-2 z-2">
							<Badge variant="secondary" className="bg-red-700 text-white shadow-sm text-xs px-2 py-0.5">
								{t("fake")}
							</Badge>
						</div>
					)}
					<div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-2">
						<Badge
							variant="secondary"
							className={`${getStatusColor(event.eventStatus)} backdrop-blur-sm shadow-sm text-xs px-2 py-0.5`}
						>
							{event.eventStatus}
						</Badge>
					</div>
					<div className="absolute bottom-2 right-2 z-2">
						<Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm text-xs px-2 py-0.5">
							{formatPrice(event.eventPrice, event.eventCurrency, t("free"))}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-3 px-3 pb-0 flex-1 flex flex-col">
				<div className="space-y-2 text-sm leading-5">
					<h3 className="text-sm leading-5 font-semibold text-foreground line-clamp-1">{event.eventName}</h3>

					<div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
						{event.eventCategories?.map((category, index) => (
							<span
								key={index}
								className="truncate text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full"
								title={`#${category}`}
							>
								#{t(category.toLowerCase())}
							</span>
						))}
					</div>

					<div className="space-y-1">
						<div className="flex items-center gap-2 text-muted-foreground">
							<MapPin className="w-3.5 h-3.5 shrink-0" />
							<span className="line-clamp-1">
								{event.locationType === "ONLINE"
									? t("online")
									: [event.eventCity, event.eventAddress].filter(Boolean).join(" • ") || t("offline")}
							</span>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground">
							<Calendar className="w-3.5 h-3.5 shrink-0" />
							<span>{formatEventRangeShort(event.eventStartAt, event.eventEndAt, i18n.language || "en", t("all_day"))}</span>
						</div>
						<div
							className="flex items-center gap-2 text-muted-foreground"
							title={
								typeof event.eventCapacity === "number" && event.eventCapacity > 0
									? t("attendees_capacity")
									: t("total_attendees")
							}
						>
							<Users className="w-3.5 h-3.5 shrink-0 text-primary" />
							<span className="tabular-nums">
								{event.attendeeCount || 0}
								{typeof event.eventCapacity === "number" && event.eventCapacity > 0 ? ` / ${event.eventCapacity}` : ""}
							</span>
						</div>
					</div>
				</div>

				<div className="px-0.5 mt-2">
					<div className="bg-muted/30 px-2.5 py-2 rounded-md flex items-center overflow-hidden">
						{event.eventDesc ? (
							<div className="text-sm text-foreground leading-relaxed w-full overflow-hidden">
								<div className="line-clamp-2 [&>p]:mb-1 [&>p]:last:mb-0 [&>strong]:font-semibold [&>a]:text-primary [&>a]:underline [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
									<ReactMarkdown
										components={{
											a: ({ ...props }) => (
												<a
													{...props}
													className="text-primary hover:underline font-medium break-all text-sm"
													target="_blank"
													rel="noopener noreferrer"
												/>
											),
											strong: ({ ...props }) => <strong {...props} className="font-semibold text-foreground" />,
											p: ({ ...props }) => <p {...props} className="mb-1 last:mb-0 text-sm text-foreground" />,
											ul: ({ ...props }) => <ul {...props} className="list-disc pl-4 mb-1 space-y-0.5 text-sm" />,
											ol: ({ ...props }) => <ol {...props} className="list-decimal pl-4 mb-1 space-y-0.5 text-sm" />,
											li: ({ ...props }) => <li {...props} className="pl-1 text-sm" />,
											h1: ({ ...props }) => (
												<h3 {...props} className="text-sm font-bold text-foreground mb-1 mt-1 first:mt-0" />
											),
											h2: ({ ...props }) => (
												<h2 {...props} className="text-sm font-bold text-foreground mb-1 mt-1 first:mt-0" />
											),
											h3: ({ ...props }) => (
												<h3 {...props} className="text-sm font-bold text-foreground mb-1 mt-1 first:mt-0" />
											),
											blockquote: ({ ...props }) => (
												<blockquote
													{...props}
													className="border-l-2 border-primary/30 pl-2 py-0.5 italic mb-1 text-muted-foreground text-sm"
												/>
											),
										}}
									>
										{event.eventDesc}
									</ReactMarkdown>
								</div>
							</div>
						) : (
							<p className="text-sm text-muted-foreground italic flex items-center justify-center py-1 w-full">
								<span className="bg-muted/50 px-2 py-0.5 rounded-md">{t("no_description_available")}</span>
							</p>
						)}
					</div>
				</div>
			</CardContent>

			<CardFooter className="border-t flex items-center justify-between gap-2 px-4 py-2.5">
				<div className="ui-like-pill">
					<Button
						variant="ghost"
						size="sm"
						className={`h-11 w-11 fine:h-9 fine:w-9 p-0 transition-colors ${
							event?.meLiked?.[0]?.myFavorite
								? "text-rose-500 hover:text-rose-500"
								: "text-muted-foreground hover:text-foreground"
						}`}
						onClick={() => likeEventHandler(event._id)}
						aria-label={event?.meLiked?.[0]?.myFavorite ? t("liked") : t("like")}
					>
						<Heart
							className={`w-4 h-4 transition-all ${event?.meLiked?.[0]?.myFavorite ? "fill-current stroke-current" : ""}`}
						/>
					</Button>
					<span className="text-sm font-medium text-muted-foreground tabular-nums">{event.eventLikes || 0}</span>
				</div>

				<Link href={`/events/${event._id}`}>
					<Button
						variant="outline"
						size="sm"
						className="h-11 w-11 fine:h-9 fine:w-9 p-0 rounded-lg hover:bg-primary/5 border-primary/30 text-primary"
						aria-label={t("view")}
					>
						<ExternalLink className="w-4 h-4" />
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default EventCard;
