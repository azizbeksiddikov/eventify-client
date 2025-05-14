import React, { useEffect, useState } from 'react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { Users, Users2, Calendar, HelpCircle } from 'lucide-react';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { MemberType } from '@/libs/enums/member.enum';
import { smallError, smallSuccess } from '@/libs/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/components/ui/tabs';

import UsersModule from '@/libs/components/admin/users/UsersModule';
import GroupsModule from '@/libs/components/admin/groups/GroupsModule';
import EventsModule from '@/libs/components/admin/events/EventsModule';
import FaqsModule from '@/libs/components/admin/faqs/FaqsModule';

import { useTranslation } from 'next-i18next';
import {
	GET_ALL_EVENTS_BY_ADMIN,
	GET_ALL_GROUPS_BY_ADMIN,
	GET_ALL_MEMBERS_BY_ADMIN,
	GET_ALL_FAQS_BY_ADMIN,
} from '@/apollo/admin/query';
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
	REMOVE_EVENT_BY_ADMIN,
	REMOVE_GROUP_BY_ADMIN,
	REMOVE_MEMBER_BY_ADMIN,
	UPDATE_EVENT_BY_ADMIN,
	UPDATE_GROUP_BY_ADMIN,
	UPDATE_MEMBER_BY_ADMIN,
	CREATE_FAQ,
	UPDATE_FAQ,
	REMOVE_FAQ,
} from '@/apollo/admin/mutation';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { GroupUpdateInput } from '@/libs/types/group/group.update';
import { EventUpdateInput } from '@/libs/types/event/event.update';
import { FaqByGroup } from '@/libs/types/faq/faq';
import { FaqInput } from '@/libs/types/faq/faq.input';
import { FaqUpdate } from '@/libs/types/faq/faq.update';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';

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
	const device = useDeviceDetect();

	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialMembersInquiry);
	const [groupsInquiry, setGroupsInquiry] = useState<GroupsInquiry>(initialGroupsInquiry);
	const [eventsInquiry, setEventsInquiry] = useState<EventsInquiry>(initialEventsInquiry);
	const [activeTab, setActiveTab] = useState<string>('users');

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
	const [faqs, setFaqs] = useState<FaqByGroup[]>([]);

	/** APOLLO REQUESTS */
	const [updateMember] = useMutation(UPDATE_MEMBER_BY_ADMIN);
	const [removeMember] = useMutation(REMOVE_MEMBER_BY_ADMIN);
	const [updateGroup] = useMutation(UPDATE_GROUP_BY_ADMIN);
	const [removeGroup] = useMutation(REMOVE_GROUP_BY_ADMIN);
	const [updateEvent] = useMutation(UPDATE_EVENT_BY_ADMIN);
	const [removeEvent] = useMutation(REMOVE_EVENT_BY_ADMIN);
	const [createFaq] = useMutation(CREATE_FAQ);
	const [updateFaq] = useMutation(UPDATE_FAQ);
	const [removeFaq] = useMutation(REMOVE_FAQ);

	const { data: userData, refetch: refetchMembers } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: {
			input: membersInquiry,
		},
		fetchPolicy: 'cache-and-network',
		skip: !user._id,
	});

	const { data: groupsData, refetch: refetchGroups } = useQuery(GET_ALL_GROUPS_BY_ADMIN, {
		variables: {
			input: groupsInquiry,
		},
		fetchPolicy: 'cache-and-network',
		skip: !user._id,
	});

	const { data: eventsData, refetch: refetchEvents } = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		variables: {
			input: eventsInquiry,
		},
		fetchPolicy: 'cache-and-network',
		skip: !user._id,
	});

	const { data: faqsData, refetch: refetchFaqs } = useQuery(GET_ALL_FAQS_BY_ADMIN, {
		skip: !user._id,
		fetchPolicy: 'cache-and-network',
	});

	/** LIFECYCLE */
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
		setLoading(false);

		const savedTab = localStorage.getItem('adminActiveTab');
		if (savedTab) {
			setActiveTab(savedTab);
		}

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

	useEffect(() => {
		if (faqsData?.getAllFaqsByAdmin) {
			setFaqs(faqsData.getAllFaqsByAdmin);
		}
	}, [faqsData]);

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
			refetchGroups(groupsInquiry);
			smallSuccess('Group removed successfully');
		}
	};

	const updateEventHandler = async (event: EventUpdateInput) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await updateEvent({ variables: { input: event } });
			smallSuccess('Event updated successfully');
		}
	};

	const removeEventHandler = async (eventId: string) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await removeEvent({ variables: { input: eventId } });
			refetchEvents(eventsInquiry);
			smallSuccess('Event removed successfully');
		}
	};

	const changeTabHandler = (value: string) => {
		setActiveTab(value);
		localStorage.setItem('adminActiveTab', value);
	};

	const createFaqHandler = async (faq: FaqInput) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await createFaq({ variables: { input: faq } });
			refetchFaqs();
			smallSuccess('Faq created successfully');
		}
	};

	const updateFaqHandler = async (faq: FaqUpdate) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await updateFaq({ variables: { input: faq } });
			refetchFaqs();
			smallSuccess('Faq updated successfully');
		}
	};

	const removeFaqHandler = async (faqId: string) => {
		if (user._id && user.memberType === MemberType.ADMIN) {
			await removeFaq({ variables: { input: faqId } });
			refetchFaqs();
			smallSuccess('Faq removed successfully');
		}
	};

	if (device === 'mobile') {
		return (
			<div className="container mx-auto py-8">
				<div className="text-center text-2xl font-bold">{t('Please, enter from Desktop')}</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<Tabs value={activeTab} onValueChange={changeTabHandler} className="w-full">
				{/* TABS LIST */}
				<TabsList className="grid w-full grid-cols-4 mb-8 h-12">
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
					<TabsTrigger value="faqs" className="flex items-center gap-2">
						<HelpCircle className="h-4 w-4" />
						{t('Faqs')}
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
				<TabsContent value="faqs" className="mt-0">
					<FaqsModule
						faqByGroup={faqs}
						createFaqHandler={createFaqHandler}
						updateFaqHandler={updateFaqHandler}
						removeFaqHandler={removeFaqHandler}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default withBasicLayout(AdminHome);
