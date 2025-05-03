import React from 'react';
import { ArrowRight } from 'lucide-react';
import GroupCard from '@/libs/components/common/GroupCard';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useQuery, useReactiveVar } from '@apollo/client';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { Direction, Message } from '@/libs/enums/common.enum';
import { GET_GROUPS } from '@/apollo/user/query';
import { Group } from '@/libs/types/group/group';
import { smallError, smallSuccess } from '@/libs/alert';
import { JOIN_GROUP, LEAVE_GROUP, LIKE_TARGET_GROUP } from '@/apollo/user/mutation';
import { useMutation } from '@apollo/client';
import { userVar } from '@/apollo/store';

interface PopularGroupsProps {
	initialInput?: GroupsInquiry;
}

const PopularGroups = ({
	initialInput = {
		page: 1,
		limit: 4,
		sort: 'groupViews',
		direction: Direction.DESC,
		search: {},
	},
}: PopularGroupsProps) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	/** APOLLO */
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinGroup] = useMutation(JOIN_GROUP);
	const [leaveGroup] = useMutation(LEAVE_GROUP);

	const { data: popularGroups } = useQuery(GET_GROUPS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const groups: Group[] = popularGroups?.getGroups?.list;

	/** HANDLERS **/
	const likeGroupHandler = async (groupId: string) => {
		try {
			if (!groupId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetGroup({
				variables: { input: groupId },
			});

			await smallSuccess(t('Group liked successfully'));
		} catch (err: any) {
			console.log('ERROR, likeGroupHandler:', err.message);
			smallError(err.message);
		}
	};

	const handleJoinGroup = async (groupId: string) => {
		try {
			if (!groupId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await joinGroup({
				variables: { input: groupId },
			});

			await smallSuccess(t('Group joined successfully'));
		} catch (err: any) {
			console.log('ERROR, handleJoinGroup:', err.message);
			smallError(err.message);
		}
	};

	const handleLeaveGroup = async (groupId: string) => {
		try {
			if (!groupId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			await leaveGroup({
				variables: { input: groupId },
			});
		} catch (err: any) {
			console.log('ERROR, handleLeaveGroup:', err.message);
			smallError(err.message);
		}
	};

	return (
		<section className="py-20 bg-muted">
			<div className="w-[90%] mx-auto ">
				<div className="flex items-center justify-between mb-8">
					<h2>{t('Popular Groups')}</h2>

					<Button type="submit" onClick={() => router.push('/groups')} className="h-14 px-8 ">
						<div className="flex items-center gap-1 ">
							{t('View All Groups')}
							<ArrowRight className="w-4 h-4" />
						</div>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{groups &&
						groups.map((group) => (
							<GroupCard
								key={group._id}
								group={group}
								likeGroupHandler={likeGroupHandler}
								handleJoinGroup={handleJoinGroup}
								handleLeaveGroup={handleLeaveGroup}
							/>
						))}
				</div>
			</div>
		</section>
	);
};

export default PopularGroups;
