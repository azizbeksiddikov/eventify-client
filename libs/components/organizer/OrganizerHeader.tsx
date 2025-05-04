import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';

const OrganizerHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-10">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<Button
					type="button"
					onClick={() => router.push('/organizer')}
					className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4 mr-2" />
						{t('Back to Organizers')}
					</div>
				</Button>
			</div>
		</section>
	);
};

export default OrganizerHeader;
