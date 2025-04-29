import { Member } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { Ticket } from '@/libs/types/ticket/ticket';
import { MemberType } from '@/libs/enums/member.enum';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { ProfileGroups } from './ProfileGroups';
import { ProfileTickets } from './ProfileTickets';
import { ProfileSettings } from './ProfileSettings';
import { ProfileFollowings } from './ProfileFollowings';
import { ProfileFollowers } from './ProfileFollowers';
import { Users, Ticket as TicketIcon, Settings, UserPlus, UserCheck } from 'lucide-react';

interface ProfileTabsProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	member: Member;
	groups: Group[];
	tickets: Ticket[];
	followings: Member[];
	followers: Member[];
	handleUpdateMember: (data: MemberUpdateInput) => void;
}

export const ProfileTabs = ({
	activeTab,
	onTabChange,
	member,
	groups,
	tickets,
	followings,
	followers,
	handleUpdateMember,
}: ProfileTabsProps) => {
	const tabs = [
		{ id: 'groups', label: 'Groups', icon: Users },
		{ id: 'tickets', label: 'Tickets', icon: TicketIcon },
		{ id: 'followings', label: 'My Followings', icon: UserPlus },
		...(member.memberType === MemberType.ORGANIZER
			? [{ id: 'followers', label: 'My Followers', icon: UserCheck }]
			: []),
		{ id: 'settings', label: 'Settings', icon: Settings },
	];

	return (
		<div className="space-y-6">
			{/* Tabs */}
			<div className="w-full flex justify-between items-center pb-2">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`
							flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl
							transition-all duration-200 mx-1
							${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
						`}
					>
						<tab.icon className="h-4 w-4" />
						<span className="text-sm font-medium">{tab.label}</span>
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="bg-white rounded-2xl shadow-sm p-6">
				{activeTab === 'groups' && (
					<ProfileGroups groups={groups} isOrganizer={member.memberType === MemberType.ORGANIZER} />
				)}
				{activeTab === 'tickets' && <ProfileTickets tickets={tickets} />}
				{activeTab === 'followings' && <ProfileFollowings followings={followings} />}
				{activeTab === 'followers' && member.memberType === MemberType.ORGANIZER && (
					<ProfileFollowers followers={followers} />
				)}
				{activeTab === 'settings' && <ProfileSettings member={member} handleUpdateMember={handleUpdateMember} />}
			</div>
		</div>
	);
};
