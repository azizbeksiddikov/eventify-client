import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useReactiveVar } from '@apollo/client';
import { ArrowRight, ArrowLeft } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';

import { userVar } from '@/apollo/store';
import { smallError } from '@/libs/alert';
import { MemberType } from '@/libs/enums/member.enum';

const ChosenGroupHeader = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	const handleCreateGroup = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t('Only organizers can create groups'));
			return;
		}
		router.push('/group/create');
	};

	return (
		<section className="bg-gradient-to-b from-secondary/40 to-background py-10">
			<div className="flex items-center justify-between mb-8 w-[90%] mx-auto">
				<Button
					type="button"
					onClick={() => router.push('/group')}
					className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4 mr-2" />
						{t('Back to Groups')}
					</div>
				</Button>

				<Button
					type="button"
					onClick={handleCreateGroup}
					className={`h-14 px-8 transition-colors duration-200 ${
						user.memberType === MemberType.ORGANIZER
							? 'bg-primary text-primary-foreground hover:bg-primary/90'
							: 'bg-muted text-muted-foreground cursor-not-allowed'
					}`}
				>
					<div className="flex items-center gap-2">
						{t('Create Group')}
						<ArrowRight className="w-4 h-4" />
					</div>
				</Button>
			</div>
		</section>
	);
};

export default ChosenGroupHeader;
