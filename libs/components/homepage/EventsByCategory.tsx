import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { userVar } from "@/apollo/store";
import { ArrowRight } from "lucide-react";

import { SectionHeader } from "@/libs/components/common/SectionHeader";
import SmallEventCard from "@/libs/components/common/SmallEventCard";
import Loading from "@/libs/components/common/Loading";

import { GET_EVENTS_BY_CATEGORY } from "@/apollo/user/query";
import { LIKE_TARGET_EVENT } from "@/apollo/user/mutation";
import { Event, CategoryEvents } from "@/libs/types/event/event";
import { EventsByCategoryInquiry } from "@/libs/types/event/event.input";
import { EventCategory } from "@/libs/enums/event.enum";
import { likeEvent } from "@/libs/utils";

interface EventsByCategoryProps {
	initialInput?: EventsByCategoryInquiry;
}

const EventsByCategory = ({
	initialInput = {
		limit: 3,
		categories: [EventCategory.TECHNOLOGY, EventCategory.ENTERTAINMENT, EventCategory.TRAVEL],
	},
}: EventsByCategoryProps) => {
	const { t } = useTranslation(["home", "events"]);
	const user = useReactiveVar(userVar);

	/** APOLLO */
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data, loading } = useQuery(GET_EVENTS_BY_CATEGORY, {
		fetchPolicy: "cache-and-network",
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});
	const eventsByCategory: CategoryEvents[] = data?.getEventsByCategory || [];

	/** HANDLERS **/
	const likeEventHandler = async (eventId: string) => {
		await likeEvent(user._id, eventId, likeTargetEvent);
	};

	return (
		<section className="bg-secondary/50 py-8 sm:py-12 md:py-16 lg:py-20 w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
				<SectionHeader title={t("events_by_category")} href="/events" linkLabel={t("view_all_events")} />

				{loading ? (
					<Loading />
				) : eventsByCategory.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
						<div className="bg-muted/50 rounded-full p-6 sm:p-8 mb-4 sm:mb-6">
							<ArrowRight className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50" />
						</div>
						<h3 className="text-foreground mb-2">{t("no_events_available")}</h3>
						<p className="text-muted-foreground max-w-md">
							{t("there_are_no_events_in_these_categories_yet_check_back_later_or_explore_other_categories")}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{eventsByCategory?.map((categoryData: CategoryEvents) => (
							<div
								key={categoryData.category}
								className="bg-card/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden border border-border/50"
							>
								<div className="p-3 sm:p-4 border-b">
									<h3 className="text-foreground">{t(`events:${categoryData.category.toLowerCase()}`)}</h3>
								</div>
								<div className="p-3 sm:p-4 flex-1">
									{categoryData.events.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-6 text-center">
											<p className="text-muted-foreground">{t("no_events_in_this_category")}</p>
										</div>
									) : (
										<div className="space-y-2 sm:space-y-3">
											{categoryData.events.map((event: Event) => (
												<SmallEventCard key={event._id} event={event} likeEventHandler={likeEventHandler} />
											))}
										</div>
									)}
								</div>
								<div className="p-2.5 sm:p-3 border-t mt-auto">
									<Link
										href={`/events?categories=${categoryData.category.toUpperCase()}`}
										aria-label={`${t("view_all_events")}: ${t(`events:${categoryData.category.toLowerCase()}`)}`}
										className="text-primary hover:text-primary font-medium flex min-h-11 items-center justify-center gap-1 transition-colors duration-200"
									>
										<ArrowRight className="w-4 h-4" />
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default EventsByCategory;
