import { ProfileGroups } from "@/libs/components/profile/ProfileGroups";
import { ProfileTickets } from "@/libs/components/profile/ProfileTickets";
import { ProfileSettings } from "@/libs/components/profile/ProfileSettings";
import { ProfileFollowings } from "@/libs/components/profile/ProfileFollowings";
import { ProfileFollowers } from "@/libs/components/profile/ProfileFollowers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/libs/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { Member } from "@/libs/types/member/member";
import { Group } from "@/libs/types/group/group";
import { Ticket } from "@/libs/types/ticket/ticket";
import { MemberUpdateInput } from "@/libs/types/member/member.update";

interface ProfileTabsProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	tabs: { id: string; label: string; icon: React.ElementType }[];
	groups: Group[];
	tickets: Ticket[];
	followings: Member[];
	followers: Member[];
	updateMemberHandler: (data: MemberUpdateInput) => void;
	likeMemberHandler: (memberId: string) => void;
	subscribeHandler: (memberId: string) => void;
	unsubscribeHandler: (memberId: string) => void;
	likeGroupHandler: (groupId: string) => void;
	joinGroupHandler: (groupId: string) => void;
	leaveGroupHandler: (groupId: string) => void;
	cancelTicketHandler: (ticketId: string) => void;
	memberUpdateInput: MemberUpdateInput;
	setMemberUpdateInput: (data: MemberUpdateInput) => void;
}

export const ProfileTabs = ({
	groups,
	tickets,
	followings,
	followers,
	updateMemberHandler,
	likeMemberHandler,
	subscribeHandler,
	unsubscribeHandler,
	likeGroupHandler,
	joinGroupHandler,
	leaveGroupHandler,
	cancelTicketHandler,
	memberUpdateInput,
	setMemberUpdateInput,
	tabs,
	activeTab,
	setActiveTab,
}: ProfileTabsProps) => {
	const activeTabData = tabs.find((tab) => tab.id === activeTab);

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
			{/* Dropdown for small screens */}
			<div className="md:hidden">
				<Select value={activeTab} onValueChange={setActiveTab}>
					<SelectTrigger className="w-full h-12">
						<div className="flex items-center gap-2 flex-1">
							{activeTabData && <activeTabData.icon className="h-4 w-4 shrink-0" />}
							<SelectValue>{activeTabData?.label || "Select a tab"}</SelectValue>
						</div>
					</SelectTrigger>
					<SelectContent>
						{tabs.map((tab) => (
							<SelectItem key={tab.id} value={tab.id}>
								<div className="flex items-center gap-2">
									<tab.icon className="h-4 w-4 shrink-0" />
									<span>{tab.label}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Tabs for larger screens */}
			<TabsList className="hidden md:flex w-full justify-between bg-muted/80 p-1.5 rounded-lg h-auto gap-1">
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.id}
						value={tab.id}
						className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-md transition-all duration-200 hover:bg-muted/50 flex-1 justify-center"
					>
						<tab.icon className="h-4 w-4 shrink-0" />
						<span className="whitespace-nowrap">{tab.label}</span>
					</TabsTrigger>
				))}
			</TabsList>

			<TabsContent value="groups" className="mt-0">
				<ProfileGroups
					groups={groups}
					likeGroupHandler={likeGroupHandler}
					joinGroupHandler={joinGroupHandler}
					leaveGroupHandler={leaveGroupHandler}
				/>
			</TabsContent>

			<TabsContent value="tickets" className="mt-0">
				<ProfileTickets tickets={tickets} cancelTicketHandler={cancelTicketHandler} />
			</TabsContent>

			<TabsContent value="followers" className="mt-0">
				<ProfileFollowers
					followers={followers}
					likeMemberHandler={likeMemberHandler}
					unsubscribeHandler={unsubscribeHandler}
					subscribeHandler={subscribeHandler}
				/>
			</TabsContent>

			<TabsContent value="followings" className="mt-0">
				<ProfileFollowings
					followings={followings}
					likeMemberHandler={likeMemberHandler}
					unsubscribeHandler={unsubscribeHandler}
				/>
			</TabsContent>

			<TabsContent value="settings" className="mt-0">
				<ProfileSettings
					updateMemberHandler={updateMemberHandler}
					memberUpdateInput={memberUpdateInput}
					setMemberUpdateInput={setMemberUpdateInput}
				/>
			</TabsContent>
		</Tabs>
	);
};
