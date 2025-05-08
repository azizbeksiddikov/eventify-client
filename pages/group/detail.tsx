import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { GET_GROUP } from '@/apollo/user/query';
import { userVar } from '@/apollo/store';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';

import { Message } from '@/libs/enums/common.enum';
import { JOIN_GROUP, LEAVE_GROUP, LIKE_TARGET_EVENT, LIKE_TARGET_GROUP } from '@/apollo/user/mutation';
import { smallSuccess, smallError } from '@/libs/alert';
import { Group } from '@/libs/types/group/group';
import ChosenGroupHeader from '@/libs/components/group/ChosenGroupHeader';
import ChosenGroupData from '@/libs/components/group/ChosenGroupData';
import { CommentGroup } from '@/libs/enums/comment.enum';
import CommentsComponent from '@/libs/components/common/CommentsComponent';
import ChosenGroupOther from '@/libs/components/group/ChosenGroupOther';
import UpcomingEvents from '@/libs/components/common/UpcomingEvents';
import { likeHandler } from '@/libs/utils';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const GroupDetailPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	const [groupId, setGroupId] = useState<string | null>(null);
	const [group, setGroup] = useState<Group | null>(null);

	/** APOLLO REQUESTS **/
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinGroup] = useMutation(JOIN_GROUP);
	const [leaveGroup] = useMutation(LEAVE_GROUP);
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { data: getGroupData, refetch: refetchGroup } = useQuery(GET_GROUP, {
		fetchPolicy: 'cache-and-network',
		skip: !groupId,
		variables: { input: groupId },
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES */
	useEffect(() => {
		if (router.query.groupId) {
			setGroupId(router.query.groupId as string);
		}
	}, [router]);

	useEffect(() => {
		if (getGroupData?.getGroup) {
			setGroup(getGroupData.getGroup);
		}
	}, [getGroupData]);

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
		}
	};

	const likeEventHandler = async (eventId: string) => {
		await likeHandler(user._id, eventId, likeTargetEvent, t('Event liked successfully'));
	};

	if (!groupId) return null;
	if (!group) return null;
	return (
		<div>
			<ChosenGroupHeader />
			<div className="w-[90%] mx-auto pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3">
						<ChosenGroupData
							userId={user._id}
							group={group}
							likeGroupHandler={likeGroupHandler}
							joinGroupHandler={handleJoinGroup}
							leaveGroupHandler={handleLeaveGroup}
						/>
						{/*  Upcoming group Events */}
						{group?.groupUpcomingEvents && (
							<UpcomingEvents
								events={group.groupUpcomingEvents}
								organizerName={group.groupName}
								likeEventHandler={likeEventHandler}
							/>
						)}
					</div>
					<ChosenGroupOther group={group} />
				</div>

				{/* Comments Section */}
				{group && <CommentsComponent commentRefId={groupId} commentGroup={CommentGroup.GROUP} />}
			</div>
		</div>
	);
};

export default withBasicLayout(GroupDetailPage);
