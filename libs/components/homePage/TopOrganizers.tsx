import { ArrowRight } from 'lucide-react';
import { organizers } from '@/data';
import OrganizerCard from '../common/OrganizerCard';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const TopOrganizers = () => {
	const router = useRouter();
	return (
		<section className="bg-secondary/50 py-20">
			<div className="w-[90%] mx-auto ">
				<div className="flex items-center justify-between mb-8">
					<h2>Top Organizers</h2>
					<Button
						type="submit"
						onClick={() => router.push('/organizers')}
						className="h-14 px-8 bg-card text-card-foreground"
					>
						<div className="flex items-center gap-1 ">
							View All Organizers
							<ArrowRight className="w-4 h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{organizers.map((organizer) => (
						<OrganizerCard key={organizer._id} organizer={organizer} />
					))}
				</div>
			</div>
		</section>
	);
};

export default TopOrganizers;
