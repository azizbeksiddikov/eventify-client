import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import SmallEventCard from '@/libs/components/common/SmallEventCard';

import { GET_EVENTS_BY_CATEGORY } from '@/apollo/user/query';
import { LIKE_TARGET_EVENT } from '@/apollo/user/mutation';
import { likeHandler } from '@/libs/utils';
import { Event, CategoryEvents } from '@/libs/types/event/event';
import { EventsByCategoryInquiry } from '@/libs/types/event/event.input';
import { EventCategory } from '@/libs/enums/event.enum';

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
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	/** APOLLO */
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data } = useQuery(GET_EVENTS_BY_CATEGORY, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});
	const eventsByCategory: CategoryEvents[] = data?.getEventsByCategory?.categories;

	/** HANDLERS **/
	const likeEventHandler = async (eventId: string) => {
		await likeHandler(user._id, eventId, likeTargetEvent, t('Event liked successfully'));
	};

	return (
		<section className="bg-secondary/50 py-20">
			<div className="w-[90%] mx-auto ">
				<div className="flex items-center justify-between mb-8">
					<h2>{t('Events by Category')}</h2>
					<Button
						type="submit"
						onClick={() => router.push('/event')}
						className="h-14 px-8 bg-card text-card-foreground"
					>
						<div className="flex items-center gap-1 ">
							{t('View All')}
							<ArrowRight className="w-4 h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{eventsByCategory?.map((categoryData: CategoryEvents) => (
						<div
							key={categoryData.category}
							className="bg-card rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn flex flex-col"
						>
							<div className="p-4 border-b border-border">
								<h3 className="text-lg font-semibold text-foreground">{categoryData.category}</h3>
							</div>
							<div className="p-4 flex-1">
								<div className="space-y-4">
									{categoryData.events.map((event: Event) => (
										<SmallEventCard key={event._id} event={event} likeEventHandler={likeEventHandler} />
									))}
								</div>
							</div>
							<div className="p-4 border-t border-border mt-auto">
								<Link
									href={`/event?category=${categoryData.category.toLowerCase()}`}
									className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors duration-200"
								>
									{t('View All')} {categoryData.category} {t('events')}
									<ArrowRight className="w-3 h-3" />
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default EventsByCategory;
