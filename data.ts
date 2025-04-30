import { Member, Members } from '@/libs/types/member/member';
import { Events } from '@/libs/types/event/event';
import { Group, Groups } from '@/libs/types/group/group';
import { Tickets } from '@/libs/types/ticket/ticket';
import { MemberType, MemberStatus } from '@/libs/enums/member.enum';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { GroupCategory } from '@/libs/enums/group.enum';
import { TicketStatus } from '@/libs/enums/ticket.enum';
import { Event } from '@/libs/types/event/event';

// Generate a date in the past
const getPastDate = (daysAgo: number) => {
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	return date;
};

// Generate a future date
const getFutureDate = (daysAhead: number) => {
	const date = new Date();
	date.setDate(date.getDate() + daysAhead);
	return date;
};

// Fake Members Data
export const fakeMembers: Members = {
	list: [
		{
			_id: '1',
			username: 'johndoe',
			memberEmail: 'john@example.com',
			memberPhone: '+1234567890',
			memberFullName: 'John Doe',
			memberType: MemberType.USER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: true,
			memberDesc: 'Tech enthusiast and event lover',
			memberPoints: 150,
			memberLikes: 45,
			memberFollowings: 120,
			memberFollowers: 85,
			memberViews: 300,
			createdAt: getPastDate(365),
			updatedAt: getPastDate(1),
			eventOrganizedCount: 0,
			memberImage:
				'https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-reacts-as-he-looks-on-during-news-photo-1725633476.jpg',
		},
		{
			_id: '2',
			username: 'eventmaster',
			memberEmail: 'organizer@example.com',
			memberPhone: '+1987654321',
			memberFullName: 'Sarah Organizer',
			memberType: MemberType.ORGANIZER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: true,
			memberDesc: 'Professional event organizer with 5 years of experience',
			memberPoints: 450,
			memberLikes: 120,
			memberFollowings: 200,
			memberFollowers: 350,
			memberViews: 1200,
			createdAt: getPastDate(730),
			updatedAt: getPastDate(2),
			eventOrganizedCount: 5,
			memberImage:
				'https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-reacts-as-he-looks-on-during-news-photo-1725633476.jpg',
		},
		{
			_id: '3',
			username: 'admin',
			memberEmail: 'admin@example.com',
			memberPhone: '+1122334455',
			memberFullName: 'Admin User',
			memberType: MemberType.ADMIN,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: true,
			memberDesc: 'System administrator',
			memberPoints: 1000,
			memberLikes: 0,
			memberFollowings: 0,
			memberFollowers: 0,
			memberViews: 0,
			createdAt: getPastDate(1095),
			updatedAt: getPastDate(0),
			eventOrganizedCount: 0,
			memberImage:
				'https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-reacts-as-he-looks-on-during-news-photo-1725633476.jpg',
		},
		{
			_id: '4',
			username: 'blockeduser',
			memberEmail: 'blocked@example.com',
			memberPhone: '+9999999999',
			memberFullName: 'Blocked User',
			memberType: MemberType.USER,
			memberStatus: MemberStatus.BLOCKED,
			emailVerified: true,
			memberDesc: 'This user has been blocked due to policy violations',
			memberPoints: 0,
			memberLikes: 0,
			memberFollowings: 0,
			memberFollowers: 0,
			memberViews: 0,
			createdAt: getPastDate(180),
			updatedAt: getPastDate(1),
			memberImage:
				'https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-reacts-as-he-looks-on-during-news-photo-1725633476.jpg',

			eventOrganizedCount: 0,
		},
		{
			_id: '5',
			username: 'neworganizer',
			memberEmail: 'neworg@example.com',
			memberPhone: '+5555555555',
			memberFullName: 'New Organizer',
			memberType: MemberType.ORGANIZER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: false,
			memberDesc: 'New event organizer looking to host events',
			memberPoints: 50,
			memberLikes: 10,
			memberFollowings: 30,
			memberFollowers: 20,
			memberViews: 100,
			createdAt: getPastDate(30),
			memberImage:
				'https://hips.hearstapps.com/hmg-prod/images/cristiano-ronaldo-of-portugal-reacts-as-he-looks-on-during-news-photo-1725633476.jpg',

			updatedAt: getPastDate(0),
			eventOrganizedCount: 10,
		},
	],
	metaCounter: [{ total: 5 }],
};

// Fake Groups Data
export const fakeGroups: Groups = {
	list: [
		{
			_id: 'g1',
			groupLink: 'tech-enthusiasts',
			groupName: 'Tech Enthusiasts',
			groupDesc: 'A community for technology lovers and innovators',
			groupOwnerId: '2',
			groupCategories: [GroupCategory.TECHNOLOGY],
			groupViews: 500,
			groupLikes: 120,
			memberCount: 150,
			eventsCount: 5,
			createdAt: getPastDate(180),
			updatedAt: getPastDate(10),
			groupImage: 'https://s3.us-east-2.amazonaws.com/s3.summitdd.org/wp-content/uploads/2024/10/1-copy.jpg',
		},
		{
			_id: 'g2',
			groupLink: 'food-lovers',
			groupName: 'Food Lovers',
			groupDesc: 'Share your love for food and cooking',
			groupOwnerId: '2',
			groupCategories: [GroupCategory.FOOD],
			groupViews: 300,
			groupLikes: 80,
			memberCount: 90,
			eventsCount: 3,
			createdAt: getPastDate(120),
			updatedAt: getPastDate(5),
			groupImage: 'https://s3.us-east-2.amazonaws.com/s3.summitdd.org/wp-content/uploads/2024/10/1-copy.jpg',
		},
		{
			_id: 'g3',
			groupLink: 'entertainment-fans',
			groupName: 'Entertainment Fans',
			groupDesc: 'For entertainment lovers and event goers',
			groupOwnerId: '5',
			groupCategories: [GroupCategory.ENTERTAINMENT],
			groupViews: 200,
			groupLikes: 50,
			memberCount: 75,
			eventsCount: 2,
			createdAt: getPastDate(60),
			updatedAt: getPastDate(2),
			groupImage: 'https://s3.us-east-2.amazonaws.com/s3.summitdd.org/wp-content/uploads/2024/10/1-copy.jpg',
		},
		{
			_id: 'g4',
			groupLink: 'sports-community',
			groupName: 'Sports Community',
			groupDesc: 'Local sports events and activities',
			groupOwnerId: '5',
			groupCategories: [GroupCategory.SPORTS],
			groupViews: 150,
			groupLikes: 40,
			memberCount: 60,
			eventsCount: 1,
			createdAt: getPastDate(45),
			updatedAt: getPastDate(1),
			groupImage: 'https://s3.us-east-2.amazonaws.com/s3.summitdd.org/wp-content/uploads/2024/10/1-copy.jpg',
		},
	],
	metaCounter: [{ total: 4 }],
};

// Fake Events Data
export const fakeEvents: Events = {
	list: [
		{
			_id: 'e1',
			eventName: 'Tech Conference 2024',
			eventDesc: 'Annual technology conference featuring latest innovations',
			eventDate: getFutureDate(30),
			eventStartTime: '09:00',
			eventEndTime: '17:00',
			eventAddress: '123 Tech Street, Silicon Valley',
			eventCapacity: 500,
			eventPrice: 99.99,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.TECHNOLOGY],
			groupId: 'g1',
			eventOrganizerId: '2',
			attendeeCount: 150,
			eventLikes: 75,
			eventViews: 300,
			createdAt: getPastDate(60),
			updatedAt: getPastDate(1),
			eventCity: 'San Francisco',
			eventImage:
				'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg',
		},
		{
			_id: 'e2',
			eventName: 'Cooking Workshop',
			eventDesc: 'Learn to cook Italian cuisine from professional chefs',
			eventDate: getFutureDate(15),
			eventStartTime: '14:00',
			eventEndTime: '18:00',
			eventAddress: '456 Food Avenue, Downtown',
			eventCapacity: 30,
			eventPrice: 49.99,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.FOOD],
			groupId: 'g2',
			eventOrganizerId: '2',
			attendeeCount: 25,
			eventLikes: 40,
			eventViews: 150,
			createdAt: getPastDate(30),
			updatedAt: getPastDate(2),
			eventImage:
				'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg',

			eventCity: 'New York',
		},
		{
			_id: 'e3',
			eventName: 'Entertainment Festival',
			eventDesc: 'Annual entertainment festival featuring local artists',
			eventDate: getFutureDate(45),
			eventStartTime: '12:00',
			eventEndTime: '23:00',
			eventImage:
				'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg',

			eventAddress: '789 Entertainment Lane, Park District',
			eventCapacity: 1000,
			eventPrice: 79.99,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.ENTERTAINMENT],
			groupId: 'g3',
			eventOrganizerId: '5',
			attendeeCount: 300,
			eventLikes: 120,
			eventViews: 500,
			createdAt: getPastDate(90),
			updatedAt: getPastDate(3),
			eventCity: 'Austin',
		},
		{
			_id: 'e4',
			eventName: 'Basketball Tournament',
			eventDesc: 'Annual city basketball tournament',
			eventDate: getFutureDate(60),
			eventStartTime: '08:00',
			eventEndTime: '20:00',
			eventAddress: '321 Sports Arena, City Center',
			eventCapacity: 200,
			eventPrice: 29.99,
			eventStatus: EventStatus.UPCOMING,
			eventCategories: [EventCategory.SPORTS],
			groupId: 'g4',
			eventOrganizerId: '5',
			attendeeCount: 150,
			eventLikes: 60,
			eventViews: 250,
			createdAt: getPastDate(120),
			updatedAt: getPastDate(5),
			eventCity: 'Seattle',
			eventImage:
				'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg',
		},
		{
			_id: 'e5',
			eventName: 'Past Tech Meetup',
			eventDesc: 'Monthly tech meetup for developers',
			eventDate: getPastDate(7),
			eventStartTime: '18:00',
			eventEndTime: '21:00',
			eventAddress: '123 Tech Street, Silicon Valley',
			eventCapacity: 100,
			eventPrice: 0,
			eventStatus: EventStatus.COMPLETED,
			eventCategories: [EventCategory.TECHNOLOGY],
			groupId: 'g1',
			eventOrganizerId: '2',
			attendeeCount: 80,
			eventLikes: 30,
			eventViews: 200,
			createdAt: getPastDate(30),
			updatedAt: getPastDate(7),
			eventCity: 'San Francisco',
			eventImage:
				'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg',
		},
	],
	metaCounter: [{ total: 5 }],
};

// Fake Tickets Data
export const fakeTickets: Tickets = {
	list: [
		{
			_id: 't1',
			eventId: 'e1',
			memberId: '1',
			ticketStatus: TicketStatus.PURCHASED,
			ticketPrice: 99.99,
			createdAt: getPastDate(10),
			updatedAt: getPastDate(10),
			event: fakeEvents.list[0],
		},
		{
			_id: 't2',
			eventId: 'e2',
			memberId: '1',
			ticketStatus: TicketStatus.CANCELLED,
			ticketPrice: 49.99,
			createdAt: getPastDate(5),
			updatedAt: getPastDate(5),
			event: fakeEvents.list[1],
		},
		{
			_id: 't3',
			eventId: 'e3',
			memberId: '1',
			ticketStatus: TicketStatus.PURCHASED,
			ticketPrice: 79.99,
			createdAt: getPastDate(20),
			updatedAt: getPastDate(20),
			event: fakeEvents.list[2],
		},
		{
			_id: 't4',
			eventId: 'e4',
			memberId: '1',
			ticketStatus: TicketStatus.PURCHASED,
			ticketPrice: 29.99,
			createdAt: getPastDate(2),
			updatedAt: getPastDate(2),
			event: fakeEvents.list[3],
		},
		{
			_id: 't5',
			eventId: 'e5',
			memberId: '1',
			ticketStatus: TicketStatus.USED,
			ticketPrice: 0,
			createdAt: getPastDate(15),
			updatedAt: getPastDate(7),
			event: fakeEvents.list[4],
		},
		{
			_id: 't6',
			eventId: 'e1',
			memberId: '4',
			ticketStatus: TicketStatus.PURCHASED,
			ticketPrice: 99.99,
			createdAt: getPastDate(8),
			updatedAt: getPastDate(8),
			event: fakeEvents.list[0],
		},
		{
			_id: 't7',
			eventId: 'e2',
			memberId: '5',
			ticketStatus: TicketStatus.PURCHASED,
			ticketPrice: 49.99,
			createdAt: getPastDate(3),
			updatedAt: getPastDate(3),
			event: fakeEvents.list[1],
		},
	],
	metaCounter: [{ total: 7 }],
};

export const eventsByCategory: { [key: string]: Event[] } = {
	TECHNOLOGY: [fakeEvents.list[0], fakeEvents.list[1]],
	ENTERTAINMENT: [fakeEvents.list[2], fakeEvents.list[3]],
	FOOD: [fakeEvents.list[4]],
};

export const eventList: Event[] = fakeEvents.list;
export const groupList: Group[] = fakeGroups.list;

export const organizers: Member[] = fakeMembers.list.slice(0, 4);
