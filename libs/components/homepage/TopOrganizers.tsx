import { userVar } from '@/apollo/store';
import { ArrowRight } from 'lucide-react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { Button } from '@/libs/components/ui/button';
import OrganizerCard from '@/libs/components/common/OrganizerCard';

import { GET_ORGANIZERS } from '@/apollo/user/query';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '@/apollo/user/mutation';
import { Member } from '@/libs/types/member/member';
import { OrganizersInquiry } from '@/libs/types/member/member.input';
import { Direction } from '@/libs/enums/common.enum';
import { followMember, likeMember, unfollowMember } from '@/libs/utils';

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
	const { t } = useTranslation('common');
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
		likeMember(user._id, memberId, likeTargetMember, t);
	};

	const subscribeHandler = async (memberId: string) => {
		followMember(user._id, memberId, subscribe, t);
	};

	const unsubscribeHandler = async (memberId: string) => {
		unfollowMember(user._id, memberId, unsubscribe, t);
	};

	return (
		<section className="bg-secondary/50 py-20">
			<div className="max-w-7xl mx-auto px-4">
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
							likeMemberHandler={likeMemberHandler}
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
