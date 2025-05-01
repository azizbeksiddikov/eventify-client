import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

const EventsHeader = () => {
	const router = useRouter();

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-24">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<div>
					<h2 className="text-left">Discover Events</h2>
					<p className="text-muted-foreground mt-2 text-lg">Find and join amazing events in your area</p>
				</div>

				<Button
					type="submit"
					onClick={() => router.push('/events/create')}
					className="h-14 px-8 bg-card text-card-foreground"
				>
					<div className="flex items-center gap-1 ">
						Create Event
						<ArrowRight className="w-4 h-4" />
					</div>
				</Button>
			</div>
		</section>
	);
};

export default EventsHeader;
