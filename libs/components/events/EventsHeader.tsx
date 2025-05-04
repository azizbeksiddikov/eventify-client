import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Button } from '@/libs/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useReactiveVar } from '@apollo/client';
import { MemberType } from '@/libs/enums/member.enum';
import { smallError } from '@/libs/alert';
import { userVar } from '@/apollo/store';

const EventsHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	const handleCreateEvent = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t('Only organizers can create events'));
			return;
		}
		router.push('/event/create');
	};
	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-24">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<div>
					<h2 className="text-left">{t('Discover Events')}</h2>
					<p className="text-muted-foreground mt-2 text-lg">{t('Find and join amazing events in your area')}</p>
				</div>

				<Button
					type="button"
					onClick={handleCreateEvent}
					className={`h-14 px-8 transition-colors duration-200 ${
						user.memberType === MemberType.ORGANIZER
							? 'bg-primary text-primary-foreground hover:bg-primary/90'
							: 'bg-muted text-muted-foreground cursor-not-allowed'
					}`}
				>
					<div className="flex items-center gap-2">
						{t('Create Event')}
						<ArrowRight className="w-4 h-4" />
					</div>
				</Button>
			</div>
		</section>
	);
};

export default EventsHeader;
