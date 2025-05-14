import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_MEMBER = gql`
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

export const GET_ORGANIZERS = gql`
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

export const GET_ORGANIZER = gql`
	query GetOrganizer($input: String!) {
		getOrganizer(input: $input) {
			_id
			username
			memberEmail
			memberPhone
			memberFullName
			eventsOrganizedCount
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
			organizedEvents {
				_id
				eventName
				eventDesc
				eventImage
				eventDate
				eventStartTime
				eventEndTime
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
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
		}
	}
`;

/**************************
 *         GROUP          *
 *************************/

export const GET_GROUPS = gql`
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

export const GET_MY_GROUPS = gql`
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

export const GET_JOINED_GROUPS = gql`
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

export const GET_GROUP = gql`
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
				createdAt
				updatedAt
			}
			groupUpcomingEvents {
				_id
				eventName
				eventDesc
				eventImage
				eventDate
				eventStartTime
				eventEndTime
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
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

export const GET_EVENT = gql`
	query GetEvent($input: String!) {
		getEvent(eventId: $input) {
			_id
			eventName
			eventDesc
			eventImage
			eventDate
			eventStartTime
			eventEndTime
			eventCity
			eventAddress
			eventCapacity
			eventPrice
			eventStatus
			eventCategories
			groupId
			memberId
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
				memberLikes
				memberFollowings
				memberFollowers
				memberViews
				memberRank
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
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
				eventName
				eventDesc
				eventImage
				eventDate
				eventStartTime
				eventEndTime
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
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
		}
	}
`;

export const GET_EVENTS = gql`
	query GetEvents($input: EventsInquiry!) {
		getEvents(input: $input) {
			list {
				_id
				eventName
				eventDesc
				eventImage
				eventDate
				eventStartTime
				eventEndTime
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
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
					memberImage
					createdAt
					updatedAt
				}
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

export const GET_EVENTS_BY_CATEGORY = gql`
	query GetEventsByCategory($input: EventsByCategoryInquiry!) {
		getEventsByCategory(input: $input) {
			categories {
				category
				events {
					_id
					eventName
					eventDesc
					eventImage
					eventDate
					eventStartTime
					eventEndTime
					eventAddress
					eventCapacity
					eventPrice
					eventStatus
					eventCategories
					groupId
					memberId
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
						memberStatus
						memberImage
					}
					meLiked {
						memberId
						likeRefId
						myFavorite
					}
				}
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryEventInquiry!) {
		getFavorites(input: $input) {
			list {
				_id
				eventName
				eventDesc
				eventImage
				eventDate
				eventStartTime
				eventEndTime
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				attendeeCount
				eventLikes
				eventViews
				groupId
				memberId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryEventInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				eventName
				eventDesc
				eventImage
				eventDate
				eventStartTime
				eventEndTime
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				attendeeCount
				eventLikes
				eventViews
				groupId
				memberId
				createdAt
				updatedAt
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

export const GET_TICKETS = gql`
	query GetTickets($input: TicketInquiry!) {
		getTickets(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_TICKETS_LIST = gql`
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
				eventName
				eventDesc
				eventImage
				eventDate
				eventStartTime
				eventEndTime
				eventCity
				eventAddress
				eventCapacity
				eventPrice
				eventStatus
				eventCategories
				groupId
				memberId
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

export const GET_COMMENTS = gql`
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

export const GET_MEMBER_FOLLOWERS_LIST = gql`
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

export const GET_MEMBER_FOLLOWINGS_LIST = gql`
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

export const GET_FAQS = gql`
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

export const GET_NOTIFICATIONS = gql`
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
