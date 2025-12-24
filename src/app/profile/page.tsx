"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { Users, Ticket as TicketIcon, Settings, UserPlus, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { userVar } from "@/apollo/store";
import {
	GET_JOINED_GROUPS,
	GET_MEMBER,
	GET_MEMBER_FOLLOWERS_LIST,
	GET_MEMBER_FOLLOWINGS_LIST,
	GET_ALL_TICKETS_LIST,
} from "@/apollo/user/query";
import {
	CANCEL_TICKET,
	JOIN_GROUP,
	LEAVE_GROUP,
	LIKE_TARGET_GROUP,
	LIKE_TARGET_MEMBER,
	SUBSCRIBE,
	UNSUBSCRIBE,
	UPDATE_MEMBER,
} from "@/apollo/user/mutation";
import { getJwtToken, updateStorage, updateUserInfo } from "@/libs/auth";
import { smallSuccess } from "@/libs/alert";
import { ProfileHeader } from "@/libs/components/profile/ProfileHeader";
import { ProfileTabs } from "@/libs/components/profile/ProfileTabs";

import { Member } from "@/libs/types/member/member";
import { Group } from "@/libs/types/group/group";
import { Ticket } from "@/libs/types/ticket/ticket";
import { MemberUpdateInput } from "@/libs/types/member/member.update";
import { followMember, joinGroup, leaveGroup, likeGroup, likeMember, unfollowMember } from "@/libs/utils";

const ProfilePage = () => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation(["profile", "errors"]);
	const router = useRouter();

	const tabs = [
		{ id: "groups", label: t("groups"), icon: Users },
		{ id: "tickets", label: t("tickets"), icon: TicketIcon },
		{ id: "followers", label: t("followers"), icon: UserCheck },
		{ id: "followings", label: t("followings"), icon: UserPlus },
		{ id: "settings", label: t("settings"), icon: Settings },
	];
	const [activeTab, setActiveTab] = useState(tabs[0].id);

	const [member, setMember] = useState<Member | null>(null);
	const [groups, setGroups] = useState<Group[]>([]);
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [followings, setFollowings] = useState<Member[]>([]);
	const [followers, setFollowers] = useState<Member[]>([]);

	const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
		username: member?.username || "",
		memberEmail: member?.memberEmail || "",
		memberPhone: member?.memberPhone || "",
		memberFullName: member?.memberFullName || "",
		memberDesc: member?.memberDesc || "",
		memberImage: member?.memberImage || "",
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

	const {
		data: getMemberData,
		refetch: refetchMember,
		loading: loadingMember,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: "cache-and-network",
		skip: !user?._id,
		variables: { input: user._id! },
		notifyOnNetworkStatusChange: true,
	});

	const { data: getJoinedGroupsData, refetch: refetchJoinedGroups } = useQuery(GET_JOINED_GROUPS, {
		fetchPolicy: "cache-and-network",
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	const { data: getTicketsData, refetch: refetchTickets } = useQuery(GET_ALL_TICKETS_LIST, {
		fetchPolicy: "cache-and-network",
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	const { data: getFollowingsData } = useQuery(GET_MEMBER_FOLLOWINGS_LIST, {
		fetchPolicy: "cache-and-network",
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	const { data: getFollowersData } = useQuery(GET_MEMBER_FOLLOWERS_LIST, {
		fetchPolicy: "cache-and-network",
		skip: !user?._id,
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLE */
	useEffect(() => {
		const jwt = getJwtToken();
		if (!jwt) {
			router.push("/auth/login");
			return;
		}
		updateUserInfo(jwt);
	}, [router]);

	useEffect(() => {
		if (getMemberData?.getMember) {
			const memberData = getMemberData.getMember;
			setMember(memberData as Member);
			setMemberUpdateInput({
				username: memberData.username || "",
				memberFullName: memberData.memberFullName || "",
				memberEmail: memberData.memberEmail || "",
				memberPhone: memberData.memberPhone || "",
				memberDesc: memberData.memberDesc || "",
				memberImage: memberData.memberImage || "",
			});
		}
	}, [getMemberData]);

	useEffect(() => {
		if (getJoinedGroupsData?.getJoinedGroups) {
			setGroups(getJoinedGroupsData.getJoinedGroups as Group[]);
		}
	}, [getJoinedGroupsData]);

	useEffect(() => {
		if (getFollowingsData?.getMemberFollowingsList) {
			setFollowings(getFollowingsData.getMemberFollowingsList as Member[]);
		}
	}, [getFollowingsData]);

	useEffect(() => {
		if (getFollowersData?.getMemberFollowersList) {
			setFollowers(getFollowersData.getMemberFollowersList as Member[]);
		}
	}, [getFollowersData]);

	useEffect(() => {
		if (getTicketsData?.getAllTicketsList) {
			setTickets(getTicketsData.getAllTicketsList as Ticket[]);
		}
	}, [getTicketsData]);

	/** HANDLERS */
	const likeMemberHandler = async (memberId: string) => {
		likeMember(user._id, memberId, likeTargetMember);
	};

	const subscribeHandler = async (memberId: string) => {
		followMember(user._id, memberId, subscribe, t);
	};

	const unsubscribeHandler = async (memberId: string) => {
		unfollowMember(user._id, memberId, unsubscribe, t);
	};

	const updateMemberHandler = async (memberUpdateInput: MemberUpdateInput) => {
		try {
			if (!user?._id) throw new Error(t("errors:not_authenticated"));

			const excludedFields = ["_id", "memberStatus", "emailVerified"];
			const cleanedMemberUpdateInput = Object.fromEntries(
				Object.entries(memberUpdateInput).filter(([key]) => !excludedFields.includes(key)),
			);

			const result = await updateMember({
				variables: { input: cleanedMemberUpdateInput },
			});

			const jwtToken = result.data?.updateMember?.accessToken;
			if (jwtToken) {
				await updateStorage({ jwtToken });
				updateUserInfo(jwtToken);
			}

			await smallSuccess(t("member_updated_successfully"));
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			console.log("ERROR, updateMemberHandler:", errorMessage);
		}
	};

	const likeGroupHandler = async (groupId: string) => {
		likeGroup(user._id, groupId, likeTargetGroup);
	};

	const joinGroupHandler = async (groupId: string) => {
		joinGroup(user._id, groupId, joinTargetGroup, t);
	};

	const leaveGroupHandler = async (groupId: string) => {
		await leaveGroup(user._id, groupId, leaveTargetGroup, t);
		refetchJoinedGroups();
	};

	const cancelTicketHandler = async (ticketId: string) => {
		try {
			if (!user?._id) throw new Error(t("errors:not_authenticated"));

			await cancelTicket({
				variables: { input: ticketId },
			});

			await smallSuccess(t("ticket_cancelled_successfully"));
			refetchMember();
			refetchTickets();
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "Unknown error";
			console.log("ERROR, cancelTicketHandler:", errorMessage);
		}
	};

	if (loadingMember || (getMemberData?.getMember && !member)) return null;
	if (!member)
		return (
			<div className="flex w-full items-center justify-center py-20 text-lg font-medium text-gray-500">No info</div>
		);
	return (
		<div className="content-container py-8 flex flex-col gap-4">
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

export default ProfilePage;
