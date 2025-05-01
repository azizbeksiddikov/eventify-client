import React, { useState } from 'react';
import { Member } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { Ticket } from '@/libs/types/ticket/ticket';
import { MemberType, MemberStatus } from '@/libs/enums/member.enum';
import { GroupCategory } from '@/libs/enums/group.enum';
import { EventCategory, EventStatus } from '@/libs/enums/event.enum';
import { TicketStatus } from '@/libs/enums/ticket.enum';
import { ProfileHeader } from '@/libs/components/profile/ProfileHeader';
import { ProfileStats } from '@/libs/components/profile/ProfileStats';
import { ProfileTabs } from '@/libs/components/profile/ProfileTabs';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { MemberUpdateInput } from '@/libs/types/member/member.update';

const ProfilePage = () => {
	const [activeTab, setActiveTab] = useState('groups');
	const [member, setMember] = useState<Member>({
		_id: '1',
		username: 'johndoe',
		memberEmail: 'john@example.com',
		memberFullName: 'John Doe',
		memberType: MemberType.ORGANIZER,
		memberStatus: MemberStatus.ACTIVE,
		emailVerified: true,
		memberDesc: 'Software developer and tech enthusiast',
		memberImage:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		memberPoints: 100,
		memberLikes: 50,
		memberFollowings: 20,
		memberFollowers: 30,
		memberViews: 1000,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const groups: Group[] = [
		{
			_id: '1',
			groupName: 'Tech Enthusiasts',
			groupDesc: 'A group for tech lovers',
			groupImage:
				'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
			groupOwnerId: '1',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupViews: 1000,
			groupLikes: 50,
			memberCount: 100,
			eventsCount: 5,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '2',
			groupName: 'Music Lovers',
			groupDesc: 'A group for music enthusiasts',
			groupImage:
				'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
			groupOwnerId: '1',
			groupCategories: [GroupCategory.ENTERTAINMENT],
			groupViews: 800,
			groupLikes: 40,
			memberCount: 80,
			eventsCount: 3,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	const tickets: Ticket[] = [
		{
			_id: '1',
			eventId: '1',
			memberId: '1',
			ticketStatus: TicketStatus.PURCHASED,
			ticketPrice: 50,
			createdAt: new Date(),
			updatedAt: new Date(),
			event: {
				_id: '1',
				eventName: 'Tech Conference 2024',
				eventDesc: 'Annual tech conference',
				eventImage:
					'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
				eventDate: new Date('2024-06-01'),
				eventStartTime: '09:00',
				eventEndTime: '17:00',
				eventAddress: '123 Tech Street',
				eventCapacity: 500,
				eventPrice: 50,
				eventStatus: EventStatus.UPCOMING,
				eventCategories: [EventCategory.TECHNOLOGY],
				groupId: '1',
				eventOrganizerId: '1',
				attendeeCount: 200,
				eventLikes: 100,
				eventViews: 1000,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
		{
			_id: '2',
			eventId: '2',
			memberId: '1',
			ticketStatus: TicketStatus.CANCELLED,
			ticketPrice: 30,
			createdAt: new Date(),
			updatedAt: new Date(),
			event: {
				_id: '2',
				eventName: 'Music Festival',
				eventDesc: 'Summer music festival',
				eventImage:
					'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
				eventDate: new Date('2024-07-15'),
				eventStartTime: '12:00',
				eventEndTime: '23:00',
				eventAddress: '456 Music Avenue',
				eventCapacity: 1000,
				eventPrice: 30,
				eventStatus: EventStatus.UPCOMING,
				eventCategories: [EventCategory.ENTERTAINMENT],
				groupId: '2',
				eventOrganizerId: '2',
				attendeeCount: 500,
				eventLikes: 200,
				eventViews: 2000,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
	];

	const followings: Member[] = [
		{
			_id: '2',
			username: 'janedoe',
			memberEmail: 'jane@example.com',
			memberFullName: 'Jane Doe',
			memberType: MemberType.USER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: true,
			memberImage:
				'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			memberPoints: 80,
			memberLikes: 40,
			memberFollowings: 15,
			memberFollowers: 25,
			memberViews: 800,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '3',
			username: 'eventorg',
			memberEmail: 'events@example.com',
			memberFullName: 'Event Organizer',
			memberType: MemberType.ORGANIZER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: true,
			memberImage:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			memberPoints: 200,
			memberLikes: 100,
			memberFollowings: 50,
			memberFollowers: 100,
			memberViews: 5000,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	const followers: Member[] = [
		{
			_id: '4',
			username: 'follower1',
			memberEmail: 'follower1@example.com',
			memberFullName: 'Follower One',
			memberType: MemberType.USER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: true,
			memberImage:
				'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			memberPoints: 60,
			memberLikes: 30,
			memberFollowings: 10,
			memberFollowers: 15,
			memberViews: 600,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			_id: '5',
			username: 'follower2',
			memberEmail: 'follower2@example.com',
			memberFullName: 'Follower Two',
			memberType: MemberType.USER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: true,
			memberImage:
				'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
			memberPoints: 70,
			memberLikes: 35,
			memberFollowings: 12,
			memberFollowers: 18,
			memberViews: 700,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	const handleUpdateMember = async (data: MemberUpdateInput) => {
		// TODO: Implement API call to update member data
		setMember({ ...member, ...data });
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<ProfileHeader member={member} />
				<ProfileStats member={member} />

				<div className="bg-white rounded-lg shadow-sm p-6">
					<ProfileTabs
						activeTab={activeTab}
						onTabChange={setActiveTab}
						member={member}
						groups={groups}
						tickets={tickets}
						followings={followings}
						followers={followers}
						handleUpdateMember={handleUpdateMember}
					/>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(ProfilePage);
