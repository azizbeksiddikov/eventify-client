import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';

const OrganizerHeader = () => {
	const router = useRouter();

	return (
		<div className="flex justify-between items-center mb-8">
			<Button
				variant="ghost"
				onClick={() => router.push('/organizers')}
				className="text-muted-foreground hover:text-foreground transition-colors duration-200"
			>
				← Back to Organizers
			</Button>
		</div>
	);
};

export default OrganizerHeader;
