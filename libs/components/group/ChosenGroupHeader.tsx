import { Button } from '../ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';

const ChosenGroupHeader = () => {
	const router = useRouter();

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-10">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<Button
					type="button"
					onClick={() => router.push('/groups')}
					className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Groups
					</div>
				</Button>

				<Button
					type="button"
					onClick={() => router.push('/groups/create')}
					className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						Create Group
						<ArrowRight className="w-4 h-4" />
					</div>
				</Button>
			</div>
		</section>
	);
};

export default ChosenGroupHeader;
