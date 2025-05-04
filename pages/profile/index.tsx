import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import axios from 'axios';
import { Users, Ticket as TicketIcon, Settings, UserPlus, UserCheck } from 'lucide-react';

import { userVar } from '@/apollo/store';
import {
	GET_JOINED_GROUPS,
	GET_MEMBER,
	GET_MEMBER_FOLLOWERS_LIST,
	GET_MEMBER_FOLLOWINGS_LIST,
	GET_TICKETS,
} from '@/apollo/user/query';
import {
	JOIN_GROUP,
	LEAVE_GROUP,
	LIKE_TARGET_GROUP,
	LIKE_TARGET_MEMBER,
	SUBSCRIBE,
	UNSUBSCRIBE,
	UPDATE_MEMBER,
} from '@/apollo/user/mutation';
import { getJwtToken, updateStorage, updateUserInfo } from '@/libs/auth';
import { smallError, smallSuccess } from '@/libs/alert';
import { REACT_APP_API_URL } from '@/libs/config';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { ProfileHeader } from '@/libs/components/profile/ProfileHeader';
import { ProfileTabs } from '@/libs/components/profile/ProfileTabs';
import { ProfileStats } from '@/libs/components/profile/ProfileStats';

import { Member } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { Ticket } from '@/libs/types/ticket/ticket';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { Message } from '@/libs/enums/common.enum';
import { readFile } from 'fs';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProfilePage = () => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const token = getJwtToken();
	const memberId = user?._id;

	const tabs = [
		{ id: 'groups', label: t('Groups'), icon: Users },
		{ id: 'tickets', label: t('Tickets'), icon: TicketIcon },
		{ id: 'followers', label: t('Followers'), icon: UserCheck },
		{ id: 'followings', label: t('Followings'), icon: UserPlus },
		{ id: 'settings', label: t('Settings'), icon: Settings },
	];
	const [activeTab, setActiveTab] = useState(tabs[0].id);

	const [member, setMember] = useState<Member | null>(null);
	const [groups, setGroups] = useState<Group[]>([]);
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [followings, setFollowings] = useState<Member[]>([]);
	const [followers, setFollowers] = useState<Member[]>([]);

	/** APOLLO */
	const [updateMember] = useMutation(UPDATE_MEMBER);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinGroup] = useMutation(JOIN_GROUP);
	const [leaveGroup] = useMutation(LEAVE_GROUP);

	const { data: getMemberData, refetch: refetchMember } = useQuery(GET_MEMBER, {
		fetchPolicy: 'cache-and-network',
		skip: !memberId,
		variables: { input: memberId },
		notifyOnNetworkStatusChange: true,
	});

	const { data: getJoinedGroupsData, refetch: refetchJoinedGroups } = useQuery(GET_JOINED_GROUPS, {
		fetchPolicy: 'cache-and-network',
		skip: !memberId,
	});

	const { data: getTicketsData, refetch: refetchTickets } = useQuery(GET_TICKETS, {
		fetchPolicy: 'cache-and-network',
		skip: !memberId,
	});

	const { data: getFollowingsData, refetch: refetchFollowings } = useQuery(GET_MEMBER_FOLLOWINGS_LIST, {
		fetchPolicy: 'cache-and-network',
		skip: !memberId,
	});

	const { data: getFollowersData, refetch: refetchFollowers } = useQuery(GET_MEMBER_FOLLOWERS_LIST, {
		fetchPolicy: 'cache-and-network',
		skip: !memberId,
	});

	/** LIFECYCLE */
	useEffect(() => {
		if (getMemberData?.getMember) {
			setMember(getMemberData.getMember);
		}
	}, [getMemberData]);

	useEffect(() => {
		if (getJoinedGroupsData?.getJoinedGroups) {
			setGroups(getJoinedGroupsData.getJoinedGroups);
		}
	}, [getJoinedGroupsData]);

	useEffect(() => {
		if (getFollowingsData?.getMemberFollowingsList) {
			setFollowings(getFollowingsData.getMemberFollowingsList);
		}
	}, [getFollowingsData]);

	useEffect(() => {
		if (getFollowersData?.getMemberFollowersList) {
			setFollowers(getFollowersData.getMemberFollowersList);
		}
	}, [getFollowersData]);

	useEffect(() => {
		if (getTicketsData?.getTickets) {
			setTickets(getTicketsData.getTickets);
		}
	}, [getTicketsData]);

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

	const updateMemberHandler = async (memberUpdateInput: MemberUpdateInput) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			const { _id, memberStatus, emailVerified, ...cleanedMemberUpdateInput } = memberUpdateInput;

			const result: any = await updateMember({
				variables: { input: cleanedMemberUpdateInput },
			});

			const jwtToken = result.data.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(jwtToken);

			await smallSuccess(t('Member updated successfully'));
		} catch (err: any) {
			console.log('ERROR, updateMemberHandler:', err.message);
			smallError(err.message);
		}
	};

	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			console.log('+image:', image);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('+responseImage: ', responseImage);
			updateMemberHandler({ ...member, memberImage: responseImage });

			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err) {
			console.log('Error, uploadImage:', err);
		}
	};

	const likeGroupHandler = async (groupId: string) => {
		try {
			if (!groupId) return;
			if (!user._id || user._id === '') throw new Error(Message.NOT_AUTHENTICATED);

			const res = await likeTargetGroup({
				variables: { input: groupId },
			});

			console.log('+res:', res);

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

			refetchJoinedGroups();

			await smallSuccess(t('Group left successfully'));
		} catch (err: any) {
			console.log('ERROR, handleLeaveGroup:', err.message);
		}
	};

	if (!member) return <div>...Loading</div>;
	return (
		<div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
			<ProfileHeader member={member} />
			<ProfileStats member={member} groupsCount={groups.length} ticketsCount={tickets.length} />

			<div className="bg-card rounded-xl shadow-sm p-6">
				<ProfileTabs
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					tabs={tabs}
					member={member}
					groups={groups}
					tickets={tickets}
					followings={followings}
					followers={followers}
					handleUpdateMember={updateMemberHandler}
					likeMemberHandler={likeMemberHandler}
					subscribeHandler={subscribeHandler}
					unsubscribeHandler={unsubscribeHandler}
					uploadImage={uploadImage}
					likeGroupHandler={likeGroupHandler}
					handleJoinGroup={handleJoinGroup}
					handleLeaveGroup={handleLeaveGroup}
				/>
			</div>
		</div>
	);
};

export default withBasicLayout(ProfilePage);
