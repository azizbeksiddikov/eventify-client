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
			memberPoints
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
				memberPoints
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
			}
			metaCounter {
				total
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
				groupLink
				groupName
				groupDesc
				groupOwnerId
				groupImage
				groupViews
				groupLikes
				groupCategories
				memberCount
				createdAt
				updatedAt
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
			groupLink
			groupName
			groupDesc
			groupOwnerId
			groupImage
			groupViews
			groupLikes
			groupCategories
			memberCount
			createdAt
			updatedAt
		}
	}
`;

export const GET_GROUP = gql`
	query GetGroup($input: String!) {
		getGroup(groupId: $input) {
			_id
			groupLink
			groupName
			groupDesc
			groupOwnerId
			groupImage
			groupViews
			groupLikes
			groupCategories
			memberCount
			createdAt
			updatedAt
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
			eventAddress
			eventCapacity
			eventPrice
			eventStatus
			eventCategories
			attendeeCount
			eventLikes
			eventViews
			groupId
			eventOrganizerId
			createdAt
			updatedAt
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
				attendeeCount
				eventLikes
				eventViews
				groupId
				eventOrganizerId
				createdAt
				updatedAt
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
					eventOrganizerId
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

export const GET_MY_EVENTS = gql`
	query GetMyEvents {
		getMyEvents {
			_id
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
			eventOrganizerId
			createdAt
			updatedAt
			eventName
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
				eventOrganizerId
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
				eventOrganizerId
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
					memberPhone
					memberFullName
					memberType
					memberPoints
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
