import { Event, CategoryEvents, Events } from "@/libs/types/event/event";
import { EventsInquiry, EventsByCategoryInquiry, OrdinaryEventInquiry } from "@/libs/types/event/event.input";
import { TotalCounter, Member, Members } from "@/libs/types/member/member";
import { OrganizersInquiry } from "@/libs/types/member/member.input";
import { Group, Groups } from "@/libs/types/group/group";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Ticket, Tickets } from "@/libs/types/ticket/ticket";
import { TicketInquiry } from "@/libs/types/ticket/ticket.input";
import { Comments } from "@/libs/types/comment/comment";
import { CommentsInquiry } from "@/libs/types/comment/comment.input";
import { Notifications } from "@/libs/types/notification/notification";
import { NotificationsInquiry } from "@/libs/types/notification/notification.input";
import { FaqByGroup } from "@/libs/types/faq/faq";
import { gql, TypedDocumentNode } from "@apollo/client";

/**************************
 *         MEMBER         *
 *************************/

type GetMemberQuery = {
	getMember: Member;
};
type GetMemberQueryVariables = {
	input: string;
};
export const GET_MEMBER: TypedDocumentNode<GetMemberQuery, GetMemberQueryVariables> = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
			_id
			username
			memberEmail
			memberPhone
			memberFullName
			memberType
			memberDesc
			memberImage
			memberStatus
			memberEvents
			emailVerified
			memberLikes
			memberFollowings
			memberFollowers
			memberViews
			createdAt
			updatedAt
		}
	}
`;

type GetOrganizersQuery = {
	getOrganizers: Members;
};
type GetOrganizersQueryVariables = {
	input: OrganizersInquiry;
};
export const GET_ORGANIZERS: TypedDocumentNode<GetOrganizersQuery, GetOrganizersQueryVariables> = gql`
	query GetOrganizers($input: OrganizersInquiry!) {
		getOrganizers(input: $input) {
			list {
				_id
				username
				memberEmail
				memberPhone
				memberFullName
				memberType
				memberDesc
				memberImage
				memberStatus
				emailVerified
				memberLikes
				memberFollowings
				memberFollowers
				memberViews
				createdAt
				updatedAt
				eventsOrganizedCount
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

type GetOrganizerQuery = {
	getOrganizer: Member & { accessToken?: string };
};
type GetOrganizerQueryVariables = {
	input: string;
};
export const GET_ORGANIZER: TypedDocumentNode<GetOrganizerQuery, GetOrganizerQueryVariables> = gql`
	query GetOrganizer($input: String!) {
		getOrganizer(input: $input) {
			_id
			username
			memberEmail
			memberPhone
			memberFullName
			memberType
			memberStatus
			emailVerified
			memberDesc
			memberImage
			memberPoints
			memberLikes
			memberFollowings
			memberFollowers
			memberViews
			memberRank
			memberGroups
			memberEvents
			createdAt
			updatedAt
			accessToken
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
			organizedGroups {
				_id
				groupName
				groupDesc
				groupImage
				memberId
				groupCategories
				groupViews
				groupLikes
				memberCount
				createdAt
				updatedAt
			}
			eventsOrganizedCount
			organizedEvents {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
			}
		}
	}
`;

/**************************
 *         GROUP          *
 *************************/

type GetGroupsQuery = {
	getGroups: Groups;
};
type GetGroupsQueryVariables = {
	input: GroupsInquiry;
};
export const GET_GROUPS: TypedDocumentNode<GetGroupsQuery, GetGroupsQueryVariables> = gql`
	query GetGroups($input: GroupsInquiry!) {
		getGroups(input: $input) {
			list {
				_id
				groupName
				groupDesc
				groupImage
				memberId
				groupCategories
				groupViews
				groupLikes
				eventsCount
				memberCount
				createdAt
				updatedAt
				memberData {
					_id
					username
					memberEmail
					memberPhone
					memberFullName
					memberType
					memberStatus
					emailVerified
					memberDesc
					memberImage
					memberLikes
					memberFollowings
					memberFollowers
					memberViews
					createdAt
					updatedAt
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meJoined {
					memberId
					groupId
					groupMemberRole
					joinDate
					meJoined
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

type GetMyGroupsQuery = {
	getMyGroups: Group[];
};
type GetMyGroupsQueryVariables = Record<string, never>;
export const GET_MY_GROUPS: TypedDocumentNode<GetMyGroupsQuery, GetMyGroupsQueryVariables> = gql`
	query GetMyGroups {
		getMyGroups {
			_id
			groupName
			groupDesc
			groupImage
			memberId
			eventsCount
			groupCategories
			groupViews
			groupLikes
			memberCount
			createdAt
			updatedAt
		}
	}
`;

type GetJoinedGroupsQuery = {
	getJoinedGroups: Group[];
};
type GetJoinedGroupsQueryVariables = Record<string, never>;
export const GET_JOINED_GROUPS: TypedDocumentNode<GetJoinedGroupsQuery, GetJoinedGroupsQueryVariables> = gql`
	query GetJoinedGroups {
		getJoinedGroups {
			_id
			groupName
			groupDesc
			groupImage
			eventsCount
			memberId
			groupCategories
			groupViews
			groupLikes
			memberCount
			createdAt
			updatedAt
			meJoined {
				memberId
				groupId
				groupMemberRole
				joinDate
				meJoined
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

type GetGroupQuery = {
	getGroup: Group;
};
type GetGroupQueryVariables = {
	input: string;
};
export const GET_GROUP: TypedDocumentNode<GetGroupQuery, GetGroupQueryVariables> = gql`
	query GetGroup($input: String!) {
		getGroup(groupId: $input) {
			_id
			groupName
			groupDesc
			groupImage
			memberId
			groupCategories
			groupViews
			groupLikes
			memberCount
			createdAt
			updatedAt
			memberData {
				_id
				username
				memberEmail
				memberPhone
				memberFullName
				memberType
				memberStatus
				emailVerified
				memberDesc
				memberImage
				memberPoints
				memberLikes
				memberFollowings
				memberFollowers
				memberViews
				memberRank
				createdAt
				updatedAt
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meJoined {
				memberId
				groupId
				groupMemberRole
				joinDate
				meJoined
			}
			meOwner
			eventsCount
			groupUpcomingEvents {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
			}
			similarGroups {
				_id
				groupName
				groupDesc
				groupImage
				memberId
				groupCategories
				groupViews
				groupLikes
				memberCount
				eventsCount
				createdAt
				updatedAt
			}
			groupModerators {
				_id
				groupId
				memberId
				groupMemberRole
				joinDate
				createdAt
				updatedAt
			}
		}
	}
`;

/**************************
 *         EVENT          *
 *************************/

type GetEventsQuery = {
	getEvents: Events;
};
type GetEventsQueryVariables = {
	input: EventsInquiry;
};
export const GET_EVENTS: TypedDocumentNode<GetEventsQuery, GetEventsQueryVariables> = gql`
	query GetEvents($input: EventsInquiry!) {
		getEvents(input: $input) {
			list {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

type GetUniqueEventsQuery = {
	getUniqueEvents: Events;
};
type GetUniqueEventsQueryVariables = {
	input: EventsInquiry;
};
export const GET_UNIQUE_EVENTS: TypedDocumentNode<GetUniqueEventsQuery, GetUniqueEventsQueryVariables> = gql`
	query GetUniqueEvents($input: EventsInquiry!) {
		getUniqueEvents(input: $input) {
			list {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

type GetEventQuery = {
	getEvent: Event;
};
type GetEventQueryVariables = {
	input: string;
};
export const GET_EVENT: TypedDocumentNode<GetEventQuery, GetEventQueryVariables> = gql`
	query GetEvent($input: String!) {
		getEvent(eventId: $input) {
			_id
			eventType
			recurrenceId
			eventName
			eventDesc
			eventImages
			eventStartAt
			eventEndAt
			eventCity
			eventAddress
			eventCapacity
			eventPrice
			eventStatus
			eventCategories
			groupId
			memberId
			origin
			attendeeCount
			eventLikes
			eventViews
			createdAt
			updatedAt
			memberData {
				_id
				username
				memberEmail
				memberPhone
				memberFullName
				memberType
				memberStatus
				emailVerified
				memberDesc
				memberImage
				memberPoints
				memberLikes
				memberFollowings
				memberFollowers
				memberViews
				memberRank
				memberGroups
				memberEvents
				eventsOrganizedCount
				createdAt
				updatedAt
				accessToken
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				organizedEvents {
					_id
					eventType
					recurrenceId
					eventName
					eventDesc
					eventImages
					eventStartAt
					eventEndAt
					eventCity
					eventAddress
					eventCapacity
					eventPrice
					eventStatus
					eventCategories
					groupId
					memberId
					origin
					attendeeCount
					eventLikes
					eventViews
					createdAt
					updatedAt
				}
				organizedGroups {
					_id
					groupName
					groupDesc
					groupImage
					memberId
					groupCategories
					groupViews
					groupLikes
					memberCount
					eventsCount
					createdAt
					updatedAt
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			hostingGroup {
				_id
				groupName
				groupDesc
				groupImage
				memberId
				groupCategories
				groupViews
				groupLikes
				memberCount
				eventsCount
				createdAt
				updatedAt
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			similarEvents {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
			}
		}
	}
`;

type GetEventsByCategoryQuery = {
	getEventsByCategory: CategoryEvents[];
};
type GetEventsByCategoryQueryVariables = {
	input: EventsByCategoryInquiry;
};
export const GET_EVENTS_BY_CATEGORY: TypedDocumentNode<GetEventsByCategoryQuery, GetEventsByCategoryQueryVariables> =
	gql`
		query GetEventsByCategory($input: EventsByCategoryInquiry!) {
			getEventsByCategory(input: $input) {
				category
				events {
					_id
					eventType
					recurrenceId
					eventName
					eventDesc
					eventImages
					eventStartAt
					eventEndAt
					eventCity
					eventAddress
					eventCapacity
					eventPrice
					eventStatus
					eventCategories
					groupId
					memberId
					origin
					attendeeCount
					eventLikes
					eventViews
					createdAt
					updatedAt
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
					memberData {
						_id
						username
						memberEmail
						memberPhone
						memberFullName
						memberType
						memberStatus
						emailVerified
						memberDesc
						memberImage
						memberPoints
						memberLikes
						memberFollowings
						memberFollowers
						memberViews
						memberRank
						memberGroups
						memberEvents
						eventsOrganizedCount
						createdAt
						updatedAt
						accessToken
					}
				}
			}
		}
	`;

type GetFavoritesQuery = {
	getFavorites: Events;
};
type GetFavoritesQueryVariables = {
	input: OrdinaryEventInquiry;
};
export const GET_FAVORITES: TypedDocumentNode<GetFavoritesQuery, GetFavoritesQueryVariables> = gql`
	query GetFavorites($input: OrdinaryEventInquiry!) {
		getFavorites(input: $input) {
			list {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					username
					memberEmail
					memberPhone
					memberFullName
					memberType
					memberStatus
					emailVerified
					memberDesc
					memberImage
					memberPoints
					memberLikes
					memberFollowings
					memberFollowers
					memberViews
					memberRank
					memberGroups
					memberEvents
					eventsOrganizedCount
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

type GetVisitedQuery = {
	getVisited: Events;
};
type GetVisitedQueryVariables = {
	input: OrdinaryEventInquiry;
};
export const GET_VISITED: TypedDocumentNode<GetVisitedQuery, GetVisitedQueryVariables> = gql`
	query GetVisited($input: OrdinaryEventInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
				memberData {
					_id
					username
					memberEmail
					memberPhone
					memberFullName
					memberType
					memberStatus
					emailVerified
					memberDesc
					memberImage
					memberPoints
					memberLikes
					memberFollowings
					memberFollowers
					memberViews
					memberRank
					memberGroups
					memberEvents
					eventsOrganizedCount
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         TICKET          *
 *************************/

type GetMyTicketsQuery = {
	getMyTickets: Tickets;
};
type GetMyTicketsQueryVariables = {
	input: TicketInquiry;
};
export const GET_MY_TICKETS: TypedDocumentNode<GetMyTicketsQuery, GetMyTicketsQueryVariables> = gql`
	query GetMyTickets($input: TicketInquiry!) {
		getMyTickets(input: $input) {
			metaCounter {
				total
			}
			list {
				_id
				eventId
				memberId
				ticketStatus
				ticketPrice
				ticketQuantity
				totalPrice
				createdAt
				updatedAt
				event {
					_id
					eventType
					recurrenceId
					eventName
					eventDesc
					eventImages
					eventStartAt
					eventEndAt
					eventCity
					eventAddress
					eventCapacity
					eventPrice
					eventStatus
					eventCategories
					groupId
					memberId
					origin
					attendeeCount
					eventLikes
					eventViews
					createdAt
					updatedAt
				}
			}
		}
	}
`;

type GetAllTicketsListQuery = {
	getAllTicketsList: Ticket[];
};
type GetAllTicketsListQueryVariables = Record<string, never>;
export const GET_ALL_TICKETS_LIST: TypedDocumentNode<GetAllTicketsListQuery, GetAllTicketsListQueryVariables> = gql`
	query GetAllTicketsList {
		getAllTicketsList {
			_id
			eventId
			memberId
			ticketStatus
			ticketPrice
			ticketQuantity
			totalPrice
			createdAt
			updatedAt
			event {
				_id
				eventType
				recurrenceId
				eventName
				eventDesc
				eventImages
				eventStartAt
				eventEndAt
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
				origin
				attendeeCount
				eventLikes
				eventViews
				createdAt
				updatedAt
			}
		}
	}
`;

/**************************
 *         COMMENT         *
 *************************/

type GetCommentsQuery = {
	getComments: Comments;
};
type GetCommentsQueryVariables = {
	input: CommentsInquiry;
};
export const GET_COMMENTS: TypedDocumentNode<GetCommentsQuery, GetCommentsQueryVariables> = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					username
					memberEmail
					memberFullName
					memberType
					memberImage
					memberStatus
					emailVerified
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOWERS         *
 *************************/

type GetMemberFollowersListQuery = {
	getMemberFollowersList: Member[];
};
type GetMemberFollowersListQueryVariables = Record<string, never>;
export const GET_MEMBER_FOLLOWERS_LIST: TypedDocumentNode<
	GetMemberFollowersListQuery,
	GetMemberFollowersListQueryVariables
> = gql`
	query GetMemberFollowersList {
		getMemberFollowersList {
			_id
			username
			memberEmail
			memberPhone
			memberFullName
			memberType
			memberStatus
			emailVerified
			memberDesc
			memberImage
			memberLikes
			memberFollowings
			memberFollowers
			memberViews
			memberRank
			memberGroups
			memberEvents
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

type GetMemberFollowingsListQuery = {
	getMemberFollowingsList: Member[];
};
type GetMemberFollowingsListQueryVariables = Record<string, never>;
export const GET_MEMBER_FOLLOWINGS_LIST: TypedDocumentNode<
	GetMemberFollowingsListQuery,
	GetMemberFollowingsListQueryVariables
> = gql`
	query GetMemberFollowingsList {
		getMemberFollowingsList {
			_id
			username
			memberEmail
			memberPhone
			memberFullName
			memberType
			memberStatus
			emailVerified
			memberDesc
			memberImage
			memberLikes
			memberFollowings
			memberFollowers
			memberViews
			memberRank
			memberGroups
			memberEvents
			createdAt
			updatedAt
			meFollowed {
				followingId
				followerId
				myFollowing
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *         FAQ             *
 *************************/

type GetFaqsQuery = {
	getFaqs: FaqByGroup[];
};
type GetFaqsQueryVariables = Record<string, never>;
export const GET_FAQS: TypedDocumentNode<GetFaqsQuery, GetFaqsQueryVariables> = gql`
	query GetFaqs {
		getFaqs {
			faqGroup
			faqs {
				_id
				faqGroup
				faqStatus
				faqQuestion
				faqAnswer
				createdAt
				updatedAt
			}
		}
	}
`;

/**************************
 *         NOTIFICATION     *
 *************************/

type GetNotificationsQuery = {
	getNotifications: Notifications;
};
type GetNotificationsQueryVariables = {
	input: NotificationsInquiry;
};
export const GET_NOTIFICATIONS: TypedDocumentNode<GetNotificationsQuery, GetNotificationsQueryVariables> = gql`
	query GetNotifications($input: NotificationsInquiry!) {
		getNotifications(input: $input) {
			list {
				_id
				memberId
				receiverId
				notificationLink
				notificationType
				isRead
				createdAt
				updatedAt
				memberData {
					_id
					username
					memberEmail
					memberFullName
					memberType
					memberStatus
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
