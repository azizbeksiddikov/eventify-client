import { Member } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { Ticket } from '@/libs/types/ticket/ticket';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { ProfileGroups } from './ProfileGroups';
import { ProfileTickets } from './ProfileTickets';
import { ProfileSettings } from './ProfileSettings';
import { ProfileFollowings } from './ProfileFollowings';
import { ProfileFollowers } from './ProfileFollowers';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/libs/components/ui/tabs';

interface ProfileTabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	tabs: { id: string; label: string; icon: React.ElementType }[];
	member: Member;
	groups: Group[];
	tickets: Ticket[];
	followings: Member[];
	followers: Member[];
	handleUpdateMember: (data: MemberUpdateInput) => void;
	likeMemberHandler: (memberId: string) => void;
	subscribeHandler: (memberId: string) => void;
	unsubscribeHandler: (memberId: string) => void;
	uploadImage: (e: any) => void;
	likeGroupHandler: (groupId: string) => void;
	handleJoinGroup: (groupId: string) => void;
	handleLeaveGroup: (groupId: string) => void;
}

export const ProfileTabs = ({
	member,
	groups,
	tickets,
	followings,
	followers,
	handleUpdateMember,
	likeMemberHandler,
	subscribeHandler,
	unsubscribeHandler,
	uploadImage,
	likeGroupHandler,
	handleJoinGroup,
	handleLeaveGroup,
	tabs,
	activeTab,
	setActiveTab,
}: ProfileTabsProps) => {
	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
			<TabsList className="w-full justify-between bg-muted/80 p-1 rounded-lg">
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.id}
						value={tab.id}
						className="flex items-center gap-2 px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm rounded-md transition-colors duration-200"
					>
						<tab.icon className="h-4 w-4" />
						<span>{tab.label}</span>
					</TabsTrigger>
				))}
			</TabsList>

			<TabsContent value="groups" className="mt-0">
				<ProfileGroups
					groups={groups}
					likeGroupHandler={likeGroupHandler}
					handleJoinGroup={handleJoinGroup}
					handleLeaveGroup={handleLeaveGroup}
				/>
			</TabsContent>

			<TabsContent value="tickets" className="mt-0">
				<ProfileTickets tickets={tickets} />
			</TabsContent>

			<TabsContent value="followings" className="mt-0">
				<ProfileFollowings followings={followings} />
			</TabsContent>

			<TabsContent value="followers" className="mt-0">
				<ProfileFollowers followers={followers} />
			</TabsContent>

			<TabsContent value="settings" className="mt-0">
				<ProfileSettings member={member} handleUpdateMember={handleUpdateMember} />
			</TabsContent>
		</Tabs>
	);
};
