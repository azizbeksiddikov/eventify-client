import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';
import { ArrowRight } from 'lucide-react';

const EventsHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-24">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<div>
					<h2 className="text-left">{t('Discover Events')}</h2>
					<p className="text-muted-foreground mt-2 text-lg">{t('Find and join amazing events in your area')}</p>
				</div>

				<Button
					type="submit"
					onClick={() => router.push('/events/create')}
					className="h-14 px-8 bg-card text-card-foreground"
				>
					<div className="flex items-center gap-1 ">
						{t('Create Event')}
						<ArrowRight className="w-4 h-4" />
					</div>
				</Button>
			</div>
		</section>
	);
};

export default EventsHeader;
