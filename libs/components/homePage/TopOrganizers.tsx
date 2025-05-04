import { ArrowRight } from 'lucide-react';
import OrganizerCard from '@/libs/components/common/OrganizerCard';
import { Button } from '@/libs/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { OrganizersInquiry } from '@/libs/types/member/member.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_ORGANIZERS } from '@/apollo/user/query';
import { Member } from '@/libs/types/member/member';
import { Direction, Message } from '@/libs/enums/common.enum';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '@/apollo/user/mutation';
import { smallError } from '@/libs/alert';
import { userVar } from '@/apollo/store';
import { smallSuccess } from '@/libs/alert';

interface TopOrganizersProps {
	initialInput?: OrganizersInquiry;
}

const TopOrganizers = ({
	initialInput = {
		page: 1,
		limit: 4,
		sort: 'memberRank',
		direction: Direction.DESC,
		search: {},
	},
}: TopOrganizersProps) => {
	const { t } = useTranslation();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** APOLLO */
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const { data: organizersData } = useQuery(GET_ORGANIZERS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: initialInput,
		},
		notifyOnNetworkStatusChange: true,
	});

	const organizers: Member[] = organizersData?.getOrganizers?.list || [];

	/** HANDLERS */
	const likeMemberHandler = async (memberId: string) => {
		try {
			if (!memberId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({
				variables: { input: memberId },
			});

			await smallSuccess(t('Member liked successfully'));
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			smallError(err.message);
		}
	};

	const subscribeHandler = async (memberId: string) => {
		try {
			if (!memberId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await subscribe({
				variables: { input: memberId },
			});

			await smallSuccess(t('Member subscribed successfully'));
		} catch (err: any) {
			console.log('ERROR, subscribeHandler:', err.message);
			smallError(err.message);
		}
	};

	const unsubscribeHandler = async (memberId: string) => {
		try {
			if (!memberId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await unsubscribe({
				variables: { input: memberId },
			});

			await smallSuccess(t('Member unsubscribed successfully'));
		} catch (err: any) {
			console.log('ERROR, unsubscribeHandler:', err.message);
			smallError(err.message);
		}
	};

	return (
		<section className="bg-secondary/50 py-20">
			<div className="w-[90%] mx-auto ">
				<div className="flex items-center justify-between mb-8">
					<h2>{t('Top Organizers')}</h2>
					<Button
						type="submit"
						onClick={() => router.push('/organizer')}
						className="h-14 px-8 bg-card text-card-foreground"
					>
						<div className="flex items-center gap-1 ">
							{t('View All Organizers')}
							<ArrowRight className="w-4 h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{organizers.map((organizer) => (
						<OrganizerCard
							key={organizer._id}
							organizer={organizer}
							likeHandler={likeMemberHandler}
							subscribeHandler={subscribeHandler}
							unsubscribeHandler={unsubscribeHandler}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default TopOrganizers;
