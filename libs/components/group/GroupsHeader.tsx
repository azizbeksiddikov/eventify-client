import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

const GroupsHeader = () => {
	const router = useRouter();

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-24">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<div>
					<h2 className="text-left">Discover Groups</h2>
					<p className="text-muted-foreground mt-2 text-lg">Find and join amazing groups in your area</p>
				</div>

				<Button
					type="submit"
					onClick={() => router.push('/groups/create')}
					className="h-14 px-8 bg-card text-card-foreground"
				>
					<div className="flex items-center gap-1 ">
						Create Group
						<ArrowRight className="w-4 h-4" />
					</div>
				</Button>
			</div>
		</section>
	);
};

export default GroupsHeader;
