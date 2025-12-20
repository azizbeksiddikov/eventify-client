import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { MapPin, Clock, CalendarIcon, ChevronRight, ArrowRight } from "lucide-react";

import { HomeCalendar } from "@/libs/components/homepage/HomeCalendar";
import { Button } from "@/libs/components/ui/button";
import { GET_EVENTS } from "@/apollo/user/query";

import { Event } from "@/libs/types/event/event";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { EventStatus } from "@/libs/enums/event.enum";

interface UpcomingEventsProps {
	initialInput?: EventsInquiry;
}

export default function UpcomingEvents({
	initialInput = {
		page: 1,
		search: { eventStatus: EventStatus.UPCOMING },
	},
}: UpcomingEventsProps) {
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
	const { t } = useTranslation("common");
	const today = new Date();
	const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	/** APOLLO */
	const { data: upcomingEvents } = useQuery(GET_EVENTS, {
		fetchPolicy: "cache-and-network",
		variables: {
			input: initialInput,
		},
		notifyOnNetworkStatusChange: true,
	});

	const events: Event[] = upcomingEvents?.getEvents?.list || [];
	const filteredEvents = events.filter(
		(event) => new Date(event.eventStartAt).toDateString() === selectedDate?.toDateString(),
	);

	return (
		<section className="py-10 sm:py-20 bg-muted">
			<div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
			<div className="flex flex-row items-center justify-start gap-3 mb-6 sm:mb-8">
					<h2 className="flex-1 min-w-0 text-foreground">{t("Upcoming Events")}</h2>
					<Button
						type="submit"
						onClick={() => router.push("/events")}
						className="shrink-0 h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-6"
					>
						<div className="flex items-center gap-1">
							{t("View All Events")}
							<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
					{/* Large Calendar - Takes most of the space */}
					<div className="md:col-span-3 bg-card rounded-lg sm:rounded-2xl shadow-sm p-3 sm:p-6">
						<HomeCalendar
							selected={selectedDate}
							onSelect={(date: Date) => setSelectedDate(date)}
							events={events}
							startMonth={startMonth}
							disableBefore={today}
						/>
					</div>

					{/* Events List - Simple bullet points */}
					<div className="md:col-span-1 md:relative">
						<div className="bg-card rounded-lg sm:rounded-2xl shadow-sm p-3 sm:p-5 h-full md:absolute md:inset-0 flex flex-col">
							<div className="flex items-center mb-3 sm:mb-4 shrink-0">
								{selectedDate !== undefined && <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2" />}

								<h3 className="text-base font-semibold text-foreground">
									{selectedDate?.toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</h3>
							</div>

							{filteredEvents.length > 0 ? (
								<ul className="space-y-2 sm:space-y-3 overflow-y-auto flex-1 min-h-0 pr-1">
									{filteredEvents.map((event: Event) => (
										<li key={event._id} className="border-l-2 border-primary pl-2 sm:pl-3 py-1">
											<Link
												href={`/events/${event._id}`}
												className="block group hover:bg-muted -ml-2 sm:-ml-3 pl-2 sm:pl-3 pr-1 sm:pr-2 py-1.5 sm:py-2 rounded-r-lg transition-colors"
											>
												<div className="flex justify-between items-start">
													<h4 className="font-medium text-foreground text-xs group-hover:text-primary transition-colors line-clamp-1">
														{event.eventName}
													</h4>
													<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
												</div>
												<div className="flex items-center mt-1 text-xs text-muted-foreground">
													<Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
													{new Date(event.eventStartAt).toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
													})}
												</div>
												<div className="flex items-center mt-1 text-xs text-muted-foreground">
													<MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 shrink-0" />
													<span className="truncate">{event.eventAddress}</span>
												</div>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<div className="flex flex-col items-center justify-center flex-1 text-center">
									<CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30 mb-2" />
									<p className="text-xs text-muted-foreground">{t("No events scheduled")}</p>
									<p className="text-xs text-muted-foreground mt-1">{t("Select another date")}</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
