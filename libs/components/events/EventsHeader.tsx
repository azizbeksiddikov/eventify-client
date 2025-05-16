import { userVar } from '@/apollo/store';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';

import { smallError } from '@/libs/alert';
import { MemberType } from '@/libs/enums/member.enum';

const EventsHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	const createEventHandler = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t('Only organizers can create events'));
			return;
		}
		router.push('/event/create');
	};
	return (
		<section className="bg-gradient-to-b from-muted-foreground/10 to-background py-8">
			<div className="flex flex-col md:flex-row items-center justify-between mb-8 max-w-7xl mx-auto">
				<div className="text-center md:text-left mb-4 md:mb-0">
					<h2>{t('Discover Events')}</h2>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">
						{t('Find and join amazing events in your area')}
					</p>
				</div>

				<Button
					type="button"
					onClick={createEventHandler}
					className={`w-full md:w-auto h-14 px-6 md:px-8 transition-colors duration-200 ${
						user.memberType === MemberType.ORGANIZER
							? 'bg-primary text-primary-foreground hover:bg-primary/90'
							: 'bg-muted text-muted-foreground cursor-not-allowed'
					}`}
				>
					<div className="flex items-center justify-center gap-2">
						{t('Create Event')}
						<ArrowRight className="w-4 h-4" />
					</div>
				</Button>
			</div>
		</section>
	);
};

export default EventsHeader;
