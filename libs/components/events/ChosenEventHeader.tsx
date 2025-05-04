import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/libs/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { MemberType } from '@/libs/enums/member.enum';
import { smallError } from '@/libs/alert';

const ChosenEventHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	const handleCreateEvent = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t('Only organizers can create events'));
			return;
		}
		router.push('/events/create');
	};

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-10">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<Button
					type="button"
					onClick={() => router.push('/events')}
					className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4 mr-2" />
						{t('Back to Events')}
					</div>
				</Button>

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

export default ChosenEventHeader;
