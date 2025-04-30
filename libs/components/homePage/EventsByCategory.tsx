import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EventCard } from './EventCardHomepage';
import { Event } from '@/libs/types/event/event';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { eventsByCategory } from '@/data';

const EventsByCategory = () => {
	const router = useRouter();

	return (
		<section className="bg-secondary/50 py-20">
			<div className="w-[90%] mx-auto ">
				<div className="flex items-center justify-between mb-8">
					<h2>Events by Category</h2>
					<Button
						type="submit"
						onClick={() => router.push('/events')}
						className="h-14 px-8 bg-card text-card-foreground"
					>
						<div className="flex items-center gap-1 ">
							View All Events
							<ArrowRight className="w-4 h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Object.entries(eventsByCategory).map(([categoryName, events]) => (
						<div
							key={categoryName}
							className="bg-card rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn flex flex-col"
						>
							<div className="p-4 border-b border-border">
								<h3 className="text-lg font-semibold text-foreground">{categoryName}</h3>
							</div>
							<div className="p-4 flex-1">
								<div className="space-y-4">
									{events.map((event: Event) => (
										<EventCard key={event._id} event={event} />
									))}
								</div>
							</div>
							<div className="p-4 border-t border-border mt-auto">
								<Link
									href={`/events?category=${categoryName.toLowerCase()}`}
									className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors duration-200"
								>
									View all {categoryName} events
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
