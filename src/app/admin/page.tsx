"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Users2, Calendar, Coins } from "lucide-react";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { userVar } from "@/apollo/store";
import { MemberType } from "@/libs/enums/member.enum";
import { smallError, smallSuccess } from "@/libs/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/libs/components/ui/tabs";

import UsersModule from "@/libs/components/admin/users/UsersModule";
import GroupsModule from "@/libs/components/admin/groups/GroupsModule";
import EventsModule from "@/libs/components/admin/events/EventsModule";
import CurrenciesModule from "@/libs/components/admin/currencies/CurrenciesModule";

import { useTranslation } from "next-i18next";
import { GET_ALL_EVENTS_BY_ADMIN, GET_ALL_GROUPS_BY_ADMIN, GET_ALL_MEMBERS_BY_ADMIN } from "@/apollo/admin/query";
import { Members } from "@/libs/types/member/member";
import { MembersInquiry } from "@/libs/types/member/member.input";
import { Direction } from "@/libs/enums/common.enum";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Groups } from "@/libs/types/group/group";
import { getJwtToken } from "@/libs/auth";
import { updateUserInfo } from "@/libs/auth";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { Events } from "@/libs/types/event/event";
import { logger } from "@/libs/logger";
import {
	REMOVE_EVENT_BY_ADMIN,
	REMOVE_GROUP_BY_ADMIN,
	REMOVE_MEMBER_BY_ADMIN,
	UPDATE_EVENT_BY_ADMIN,
	UPDATE_GROUP_BY_ADMIN,
	UPDATE_MEMBER_BY_ADMIN,
} from "@/apollo/admin/mutation";
import { MemberUpdateInput } from "@/libs/types/member/member.update";
import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { EventUpdateInput } from "@/libs/types/event/event.update";

interface AdminHomeProps {
	initialMembersInquiry?: MembersInquiry;
	initialGroupsInquiry?: GroupsInquiry;
	initialEventsInquiry?: EventsInquiry;
}

const defaultMembersInquiry: MembersInquiry = {
	page: 1,
	limit: 10,
	sort: "createdAt",
	direction: Direction.DESC,
	search: {
		text: undefined,
		memberStatus: undefined,
		memberType: undefined,
	},
};

const defaultGroupsInquiry: GroupsInquiry = {
	page: 1,
	limit: 10,
	sort: "createdAt",
	direction: Direction.DESC,
	search: {
		text: "",
		groupCategories: [],
	},
};

const defaultEventsInquiry: EventsInquiry = {
	page: 1,
	limit: 10,
	sort: "eventStartAt",
	direction: Direction.DESC,
	search: {
		text: "",
		eventCategories: [],
		eventStatus: undefined,
		eventStartDay: undefined,
		eventEndDay: undefined,
	},
};

const AdminHome = ({
	initialMembersInquiry = defaultMembersInquiry,
	initialGroupsInquiry = defaultGroupsInquiry,
	initialEventsInquiry = defaultEventsInquiry,
}: AdminHomeProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation("admin");

	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialMembersInquiry);
	const [groupsInquiry, setGroupsInquiry] = useState<GroupsInquiry>(initialGroupsInquiry);
	const [eventsInquiry, setEventsInquiry] = useState<EventsInquiry>(initialEventsInquiry);
	const [activeTab, setActiveTab] = useState<string>(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("adminActiveTab") || "users";
		}
		return "users";
	});

	/** APOLLO REQUESTS */
	const [updateMember] = useMutation(UPDATE_MEMBER_BY_ADMIN);
	const [removeMember] = useMutation(REMOVE_MEMBER_BY_ADMIN);
	const [updateGroup] = useMutation(UPDATE_GROUP_BY_ADMIN);
	const [removeGroup] = useMutation(REMOVE_GROUP_BY_ADMIN);
	const [updateEvent] = useMutation(UPDATE_EVENT_BY_ADMIN);
	const [removeEvent] = useMutation(REMOVE_EVENT_BY_ADMIN);

	const { data: userData, refetch: refetchMembers } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: {
			input: membersInquiry,
		},
		fetchPolicy: "cache-and-network",
		skip: !user._id,
	});

	const { data: groupsData, refetch: refetchGroups } = useQuery(GET_ALL_GROUPS_BY_ADMIN, {
		variables: {
			input: groupsInquiry,
		},
		fetchPolicy: "cache-and-network",
		skip: !user._id,
	});

	const { data: eventsData, refetch: refetchEvents } = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		variables: {
			input: eventsInquiry,
		},
		fetchPolicy: "cache-and-network",
		skip: !user._id,
	});

	// Derive data directly from Apollo queries - no need for duplicate state
	const members: Members = userData?.getAllMembersByAdmin || { list: [], metaCounter: [] };
	const groups: Groups = groupsData?.getAllGroupsByAdmin || { list: [], metaCounter: [] };
	const events: Events = eventsData?.getAllEventsByAdmin || { list: [], metaCounter: [] };

	/** LIFECYCLE */
	useEffect(() => {
		logger.logComponentLifecycle("AdminHome", "mount");
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
		return () => {
			logger.logComponentLifecycle("AdminHome", "unmount");
		};
	}, []);

	useEffect(() => {
		if (user._id && user.memberType !== MemberType.ADMIN) {
			logger.warn("Unauthorized access attempt to admin page", {
				userId: user._id,
				memberType: user.memberType,
			});
			smallError("You are not authorized to access this page");
			router.push("/");
		}
	}, [user, router]);

	useEffect(() => {
		if (userData?.getAllMembersByAdmin) {
			logger.debug("Members data loaded", {
				count: members.list.length,
				total: members.metaCounter[0]?.total || 0,
			});
		}
	}, [userData, members]);

	useEffect(() => {
		if (groupsData?.getAllGroupsByAdmin) {
			logger.debug("Groups data loaded", {
				count: groups.list.length,
				total: groups.metaCounter[0]?.total || 0,
			});
		}
	}, [groupsData, groups]);

	useEffect(() => {
		if (eventsData?.getAllEventsByAdmin) {
			logger.debug("Events data loaded", {
				count: events.list.length,
				total: events.metaCounter[0]?.total || 0,
			});
		}
	}, [eventsData, events]);

	/** HANDLERS */
	const updateMemberHandler = async (member: MemberUpdateInput) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			logger.logUserAction("Update member", { memberId: member._id });
			const startTime = Date.now();
			try {
				await updateMember({ variables: { input: member } });
				const duration = Date.now() - startTime;
				logger.logGraphQLSuccess("mutation", "UPDATE_MEMBER_BY_ADMIN", duration, { memberId: member._id });
				// refetchMembers(membersInquiry);
				smallSuccess("Member updated successfully");
			} catch (error) {
				logger.logGraphQLError("mutation", "UPDATE_MEMBER_BY_ADMIN", error, { memberId: member._id });
				throw error;
			}
		}
	};

	const removeMemberHandler = async (memberId: string) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			logger.logUserAction("Remove member", { memberId });
			const startTime = Date.now();
			try {
				await removeMember({ variables: { input: memberId } });
				const duration = Date.now() - startTime;
				logger.logGraphQLSuccess("mutation", "REMOVE_MEMBER_BY_ADMIN", duration, { memberId });
				refetchMembers();
				smallSuccess("Member removed successfully");
			} catch (error) {
				logger.logGraphQLError("mutation", "REMOVE_MEMBER_BY_ADMIN", error, { memberId });
				throw error;
			}
		}
	};

	const updateGroupHandler = async (group: GroupUpdateInput) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			logger.logUserAction("Update group", { groupId: group._id });
			const startTime = Date.now();
			try {
				await updateGroup({ variables: { input: group } });
				const duration = Date.now() - startTime;
				logger.logGraphQLSuccess("mutation", "UPDATE_GROUP_BY_ADMIN", duration, { groupId: group._id });
				smallSuccess("Group updated successfully");
			} catch (error) {
				logger.logGraphQLError("mutation", "UPDATE_GROUP_BY_ADMIN", error, { groupId: group._id });
				throw error;
			}
		}
	};

	const removeGroupHandler = async (groupId: string) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			logger.logUserAction("Remove group", { groupId });
			const startTime = Date.now();
			try {
				await removeGroup({ variables: { input: groupId } });
				const duration = Date.now() - startTime;
				logger.logGraphQLSuccess("mutation", "REMOVE_GROUP_BY_ADMIN", duration, { groupId });
				refetchGroups();
				smallSuccess("Group removed successfully");
			} catch (error) {
				logger.logGraphQLError("mutation", "REMOVE_GROUP_BY_ADMIN", error, { groupId });
				throw error;
			}
		}
	};

	const updateEventHandler = async (event: EventUpdateInput) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			logger.logUserAction("Update event", { eventId: event._id });
			const startTime = Date.now();
			try {
				await updateEvent({ variables: { input: event } });
				const duration = Date.now() - startTime;
				logger.logGraphQLSuccess("mutation", "UPDATE_EVENT_BY_ADMIN", duration, { eventId: event._id });
				smallSuccess("Event updated successfully");
			} catch (error) {
				logger.logGraphQLError("mutation", "UPDATE_EVENT_BY_ADMIN", error, { eventId: event._id });
				throw error;
			}
		}
	};

	const removeEventHandler = async (eventId: string) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			logger.logUserAction("Remove event", { eventId });
			const startTime = Date.now();
			try {
				await removeEvent({ variables: { input: eventId } });
				const duration = Date.now() - startTime;
				logger.logGraphQLSuccess("mutation", "REMOVE_EVENT_BY_ADMIN", duration, { eventId });
				refetchEvents();
				smallSuccess("Event removed successfully");
			} catch (error) {
				logger.logGraphQLError("mutation", "REMOVE_EVENT_BY_ADMIN", error, { eventId });
				throw error;
			}
		}
	};

	const changeTabHandler = (value: string) => {
		logger.logUserAction("Admin tab changed", { from: activeTab, to: value });
		setActiveTab(value);
		localStorage.setItem("adminActiveTab", value);
	};

	return (
		<div className="content-container py-8">
			{/* Mobile warning - only visible on small screens */}
			<div className="block md:hidden text-center py-8">
				<div className="text-2xl font-bold">{t("please_enter_from_desktop")}</div>
			</div>

			{/* Admin content - only visible on medium+ screens */}
			<div className="hidden md:block">
				<Tabs value={activeTab} onValueChange={changeTabHandler} className="w-full">
					{/* TABS LIST */}
					<TabsList className="grid w-full grid-cols-4 mb-8 h-12">
						<TabsTrigger value="users" className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							{t("users")}
						</TabsTrigger>
						<TabsTrigger value="groups" className="flex items-center gap-2">
							<Users2 className="h-4 w-4" />
							{t("groups")}
						</TabsTrigger>
						<TabsTrigger value="events" className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							{t("events")}
						</TabsTrigger>
						<TabsTrigger value="currencies" className="flex items-center gap-2">
							<Coins className="h-4 w-4" />
							Currencies
						</TabsTrigger>
					</TabsList>
					{/* TABS CONTENT */}
					<TabsContent value="users" className="mt-0">
						<UsersModule
							members={members}
							initialInquiry={defaultMembersInquiry}
							membersInquiry={membersInquiry}
							setMembersInquiry={setMembersInquiry}
							updateMemberHandler={updateMemberHandler}
							removeMemberHandler={removeMemberHandler}
						/>
					</TabsContent>
					<TabsContent value="groups" className="mt-0">
						<GroupsModule
							groups={groups}
							initialInquiry={defaultGroupsInquiry}
							groupsInquiry={groupsInquiry}
							setGroupsInquiry={setGroupsInquiry}
							updateGroupHandler={updateGroupHandler}
							removeGroupHandler={removeGroupHandler}
						/>
					</TabsContent>
					<TabsContent value="events" className="mt-0">
						<EventsModule
							events={events}
							initialInquiry={defaultEventsInquiry}
							eventsInquiry={eventsInquiry}
							setEventsInquiry={setEventsInquiry}
							updateEventHandler={updateEventHandler}
							removeEventHandler={removeEventHandler}
						/>
					</TabsContent>
					<TabsContent value="currencies" className="mt-0">
						<CurrenciesModule />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default AdminHome;
