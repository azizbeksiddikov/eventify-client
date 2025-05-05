import React, { useEffect, useState } from 'react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { Users, Users2, Calendar } from 'lucide-react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { MemberType } from '@/libs/enums/member.enum';
import { smallError, smallSuccess } from '@/libs/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/components/ui/tabs';

import UsersModule from '@/libs/components/admin/users/UsersModule';
import GroupsModule from '@/libs/components/admin/groups/GroupsModule';
import EventsModule from '@/libs/components/admin/events/EventsModule';
import { useTranslation } from 'react-i18next';
import { GET_ALL_EVENTS_BY_ADMIN, GET_ALL_GROUPS_BY_ADMIN, GET_ALL_MEMBERS_BY_ADMIN } from '@/apollo/admin/query';
import { Members } from '@/libs/types/member/member';
import { MembersInquiry } from '@/libs/types/member/member.input';
import { Direction } from '@/libs/enums/common.enum';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { Groups } from '@/libs/types/group/group';
import { getJwtToken } from '@/libs/auth';
import { updateUserInfo } from '@/libs/auth';
import { EventsInquiry } from '@/libs/types/event/event.input';
import { Events } from '@/libs/types/event/event';
import {
	REMOVE_GROUP_BY_ADMIN,
	REMOVE_MEMBER_BY_ADMIN,
	UPDATE_GROUP_BY_ADMIN,
	UPDATE_MEMBER_BY_ADMIN,
} from '@/apollo/admin/mutation';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { GroupUpdateInput } from '@/libs/types/group/group.update';

interface AdminHomeProps {
	initialMembersInquiry?: MembersInquiry;
	initialGroupsInquiry?: GroupsInquiry;
	initialEventsInquiry?: EventsInquiry;
}

const defaultMembersInquiry: MembersInquiry = {
	page: 1,
	limit: 10,
	sort: 'createdAt',
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
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		text: '',
		groupCategories: [],
	},
};

const defaultEventsInquiry: EventsInquiry = {
	page: 1,
	limit: 10,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		text: '',
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
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);

	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialMembersInquiry);
	const [groupsInquiry, setGroupsInquiry] = useState<GroupsInquiry>(initialGroupsInquiry);
	const [eventsInquiry, setEventsInquiry] = useState<EventsInquiry>(initialEventsInquiry);

	const [members, setMembers] = useState<Members>({
		list: [],
		metaCounter: [],
	});
	const [groups, setGroups] = useState<Groups>({
		list: [],
		metaCounter: [],
	});
	const [events, setEvents] = useState<Events>({
		list: [],
		metaCounter: [],
	});

	/** APOLLO REQUESTS */
	const [updateMember] = useMutation(UPDATE_MEMBER_BY_ADMIN);
	const [removeMember] = useMutation(REMOVE_MEMBER_BY_ADMIN);
	const [updateGroup] = useMutation(UPDATE_GROUP_BY_ADMIN);
	const [removeGroup] = useMutation(REMOVE_GROUP_BY_ADMIN);

	const { data: userData, refetch: refetchMembers } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: {
			input: membersInquiry,
		},
		fetchPolicy: 'cache-and-network',
		skip: !user._id,
	});

	const { data: groupsData } = useQuery(GET_ALL_GROUPS_BY_ADMIN, {
		variables: {
			input: groupsInquiry,
		},
		fetchPolicy: 'cache-and-network',
		skip: !user._id,
	});

	const { data: eventsData } = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		variables: {
			input: eventsInquiry,
		},
		fetchPolicy: 'cache-and-network',
		skip: !user._id,
	});

	/** LIFECYCLE */
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (!loading && user.memberType !== MemberType.ADMIN) {
			smallError('You are not authorized to access this page');
			router.push('/').then();
		}
	}, [loading, user, router]);

	useEffect(() => {
		if (userData?.getAllMembersByAdmin) {
			setMembers(userData.getAllMembersByAdmin);
		}
	}, [userData]);

	useEffect(() => {
		if (groupsData?.getAllGroupsByAdmin) {
			setGroups(groupsData.getAllGroupsByAdmin);
		}
	}, [groupsData]);

	useEffect(() => {
		if (eventsData?.getAllEventsByAdmin) {
			setEvents(eventsData.getAllEventsByAdmin);
		}
	}, [eventsData]);

	/** HANDLERS */
	const updateMemberHandler = async (member: MemberUpdateInput) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await updateMember({ variables: { input: member } });
			// refetchMembers(membersInquiry);
			smallSuccess('Member updated successfully');
		}
	};

	const removeMemberHandler = async (memberId: string) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await removeMember({ variables: { input: memberId } });
			refetchMembers(membersInquiry);
			smallSuccess('Member removed successfully');
		}
	};

	const updateGroupHandler = async (group: GroupUpdateInput) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await updateGroup({ variables: { input: group } });
			smallSuccess('Group updated successfully');
		}
	};

	const removeGroupHandler = async (groupId: string) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await removeGroup({ variables: { input: groupId } });
			smallSuccess('Group removed successfully');
		}
	};

	return (
		<div className="container mx-auto py-8">
			<Tabs defaultValue="users" className="w-full">
				{/* TABS LIST */}
				<TabsList className="grid w-full grid-cols-3 mb-8">
					<TabsTrigger value="users" className="flex items-center gap-2">
						<Users className="h-4 w-4" />
						{t('Users')}
					</TabsTrigger>
					<TabsTrigger value="groups" className="flex items-center gap-2">
						<Users2 className="h-4 w-4" />
						{t('Groups')}
					</TabsTrigger>
					<TabsTrigger value="events" className="flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						{t('Events')}
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
					<EventsModule />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default withBasicLayout(AdminHome);
