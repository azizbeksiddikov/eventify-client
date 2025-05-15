import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';

const OrganizerHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	return (
		<section className="bg-gradient-to-b from-secondary to-background py-4 sm:py-6 md:py-8">
			<div className="flex items-center justify-between mb-4 max-w-7xl mx-auto">
				<Button
					type="button"
					onClick={() => router.push('/organizer')}
					className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
						<span className="text-sm sm:text-base">{t('Back to Organizers')}</span>
					</div>
				</Button>
			</div>
		</section>
	);
};

export default OrganizerHeader;
