import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';

import { Button } from '@/libs/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { smallError } from '@/libs/alert';
import { MemberType } from '@/libs/enums/member.enum';

const ChosenEventHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	const createHandler = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t('Only organizers can create events'));
			return;
		}
		router.push('/event/create');
	};

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-8 w-[95%] max-w-7xl flex flex-row items-center justify-between mx-auto">
			<Button
				type="button"
				onClick={() => router.push('/event')}
				className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
			>
				<div className="flex items-center gap-2">
					<ArrowLeft className="w-4 h-4" />
					{t('Back to Events')}
				</div>
			</Button>

			<Button
				type="button"
				onClick={createHandler}
				className={`h-12 px-6 transition-colors duration-200 ${
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
		</section>
	);
};

export default ChosenEventHeader;
