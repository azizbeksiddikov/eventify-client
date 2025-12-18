import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { useMutation, useQuery, useReactiveVar, useApolloClient } from "@apollo/client/react";
import { userVar } from "@/apollo/store";
import { ArrowRight } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import SmallEventCard from "@/libs/components/common/SmallEventCard";

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
	const router = useRouter();
	const { t } = useTranslation("common");
	const user = useReactiveVar(userVar);
	const client = useApolloClient();

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
		if (!user._id) {
			router.push("/auth/login");
			return;
		}
		await likeEvent(user._id, eventId, likeTargetEvent, client.cache);
	};

	return (
		<section className="bg-secondary/50 py-8 sm:py-12 md:py-16 lg:py-20 w-full">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
				<div className="flex flex-row items-center justify-start gap-3 mb-6 sm:mb-8">
					<h2 className="flex-1 min-w-0 text-foreground">{t("Events by Category")}</h2>
					<Button
						type="submit"
						onClick={() => router.push("/events")}
						className="shrink-0 h-9 sm:h-10 md:h-12 px-3 sm:px-4 md:px-6 bg-card text-card-foreground hover:bg-card/90"
					>
						<div className="flex items-center gap-1">
							{t("View All Events")}
							<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
						</div>
					</Button>
				</div>

				{loading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{[1, 2, 3].map((index) => (
							<div
								key={index}
								className="bg-card rounded-xl shadow-sm overflow-hidden animate-pulse border border-border/50"
							>
								<div className="p-4 border-b">
									<div className="h-6 bg-muted rounded w-32"></div>
								</div>
								<div className="p-4 space-y-4">
									{[1, 2, 3].map((i) => (
										<div key={i} className="flex gap-3">
											<div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-lg shrink-0"></div>
											<div className="flex-1 space-y-2">
												<div className="h-4 bg-muted rounded w-3/4"></div>
												<div className="h-3 bg-muted rounded w-1/2"></div>
											</div>
										</div>
									))}
								</div>
								<div className="p-4 border-t">
									<div className="h-4 bg-muted rounded w-40"></div>
								</div>
							</div>
						))}
					</div>
				) : eventsByCategory.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
						<div className="bg-muted/50 rounded-full p-6 sm:p-8 mb-4 sm:mb-6">
							<ArrowRight className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50" />
						</div>
						<h3 className="text-foreground mb-2">{t("No Events Available")}</h3>
						<p className="text-muted-foreground max-w-md">
							{t("There are no events in these categories yet. Check back later or explore other categories.")}
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
									<h3 className="text-foreground">{categoryData.category}</h3>
								</div>
								<div className="p-3 sm:p-4 flex-1">
									{categoryData.events.length === 0 ? (
										<div className="flex flex-col items-center justify-center py-6 text-center">
											<p className="text-muted-foreground">{t("No events in this category")}</p>
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
										href={`/event?categories=${categoryData.category.toUpperCase()}`}
										className="text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-1 transition-colors duration-200"
									>
										<ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
