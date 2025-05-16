import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Users, Ticket as TicketIcon, Settings, UserPlus, UserCheck } from 'lucide-react';
import { useRouter } from 'next/router';

import { userVar } from '@/apollo/store';
import {
	GET_JOINED_GROUPS,
	GET_MEMBER,
	GET_MEMBER_FOLLOWERS_LIST,
	GET_MEMBER_FOLLOWINGS_LIST,
	GET_ALL_TICKETS_LIST,
} from '@/apollo/user/query';
import {
	CANCEL_TICKET,
	JOIN_GROUP,
	LEAVE_GROUP,
	LIKE_TARGET_GROUP,
	LIKE_TARGET_MEMBER,
	SUBSCRIBE,
	UNSUBSCRIBE,
	UPDATE_MEMBER,
} from '@/apollo/user/mutation';
import { getJwtToken, updateStorage, updateUserInfo } from '@/libs/auth';
import { smallSuccess } from '@/libs/alert';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { ProfileHeader } from '@/libs/components/profile/ProfileHeader';
import { ProfileTabs } from '@/libs/components/profile/ProfileTabs';

import { Member } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { Ticket } from '@/libs/types/ticket/ticket';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { followMember, joinGroup, leaveGroup, likeGroup, likeMember, unfollowMember } from '@/libs/utils';
import { Message } from '@/libs/enums/common.enum';

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProfilePage = () => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const router = useRouter();

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

	const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
		username: member?.username || '',
		memberEmail: member?.memberEmail || '',
		memberPhone: member?.memberPhone || '',
		memberFullName: member?.memberFullName || '',
		memberDesc: member?.memberDesc || '',
		memberImage: member?.memberImage || '',
	});

	/** APOLLO */
	const [updateMember] = useMutation(UPDATE_MEMBER);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetGroup] = useMutation(LIKE_TARGET_GROUP);
	const [joinTargetGroup] = useMutation(JOIN_GROUP);
	const [leaveTargetGroup] = useMutation(LEAVE_GROUP);
	const [cancelTicket] = useMutation(CANCEL_TICKET);

	const { data: getMemberData, refetch: refetchMember } = useQuery(GET_MEMBER, {
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
		variables: { input: user?._id },
		notifyOnNetworkStatusChange: true,
	});

	const { data: getJoinedGroupsData, refetch: refetchJoinedGroups } = useQuery(GET_JOINED_GROUPS, {
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	const { data: getTicketsData, refetch: refetchTickets } = useQuery(GET_ALL_TICKETS_LIST, {
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	const { data: getFollowingsData } = useQuery(GET_MEMBER_FOLLOWINGS_LIST, {
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	const { data: getFollowersData } = useQuery(GET_MEMBER_FOLLOWERS_LIST, {
		fetchPolicy: 'cache-and-network',
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLE */
	useEffect(() => {
		const jwt = getJwtToken();
		if (!jwt) {
			router.push('/auth/login');
			return;
		}
		updateUserInfo(jwt);
	}, [router]);

	useEffect(() => {
		if (getMemberData?.getMember) {
			setMember(getMemberData.getMember);
			setMemberUpdateInput({
				username: getMemberData.getMember.username,
				memberFullName: getMemberData.getMember.memberFullName,
				memberEmail: getMemberData.getMember.memberEmail,
				memberPhone: getMemberData.getMember.memberPhone,
				memberDesc: getMemberData.getMember.memberDesc,
				memberImage: getMemberData.getMember.memberImage,
			});
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
		if (getTicketsData?.getAllTicketsList) {
			setTickets(getTicketsData.getAllTicketsList);
		}
	}, [getTicketsData]);

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

	const updateMemberHandler = async (memberUpdateInput: MemberUpdateInput) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			const excludedFields = ['_id', 'memberStatus', 'emailVerified'];
			const cleanedMemberUpdateInput = Object.fromEntries(
				Object.entries(memberUpdateInput).filter(([key]) => !excludedFields.includes(key)),
			);

			const result: any = await updateMember({
				variables: { input: cleanedMemberUpdateInput },
			});

			const jwtToken = result.data.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(jwtToken);

			await smallSuccess(t(Message.MEMBER_UPDATED_SUCCESSFULLY));
		} catch (err: any) {
			console.log('ERROR, updateMemberHandler:', err.message);
		}
	};

	const likeGroupHandler = async (groupId: string) => {
		likeGroup(user._id, groupId, likeTargetGroup, t);
	};

	const joinGroupHandler = async (groupId: string) => {
		joinGroup(user._id, groupId, joinTargetGroup, t);
	};

	const leaveGroupHandler = async (groupId: string) => {
		leaveGroup(user._id, groupId, leaveTargetGroup, t);
		refetchJoinedGroups();
	};

	const cancelTicketHandler = async (ticketId: string) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			await cancelTicket({
				variables: { input: ticketId },
			});

			await smallSuccess(t(Message.TICKET_CANCELLED_SUCCESSFULLY));
			refetchMember();
			refetchTickets();
		} catch (err: any) {
			console.log('ERROR, cancelTicketHandler:', err.message);
		}
	};

	if (!member) return <div>...Loading</div>;
	return (
		<div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 flex flex-col gap-4">
			<ProfileHeader member={member} groupsCount={groups.length} ticketsCount={tickets.length} />

			<div className="bg-card rounded-xl shadow-sm p-6">
				<ProfileTabs
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					tabs={tabs}
					groups={groups}
					tickets={tickets}
					followings={followings}
					followers={followers}
					updateMemberHandler={updateMemberHandler}
					likeMemberHandler={likeMemberHandler}
					subscribeHandler={subscribeHandler}
					unsubscribeHandler={unsubscribeHandler}
					likeGroupHandler={likeGroupHandler}
					joinGroupHandler={joinGroupHandler}
					leaveGroupHandler={leaveGroupHandler}
					cancelTicketHandler={cancelTicketHandler}
					memberUpdateInput={memberUpdateInput}
					setMemberUpdateInput={setMemberUpdateInput}
				/>
			</div>
		</div>
	);
};

export default withBasicLayout(ProfilePage);
