import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdateInput!) {
		updateMember(input: $input) {
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
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
		}
	}
`;

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
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
			followerData {
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
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         GROUP          *
 *************************/

export const CREATE_GROUP = gql`
	mutation CreateGroup($input: GroupInput!) {
		createGroup(input: $input) {
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

export const UPDATE_GROUP = gql`
	mutation UpdateGroup($input: GroupUpdateInput!) {
		updateGroup(input: $input) {
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

export const JOIN_GROUP = gql`
	mutation JoinGroup($input: String!) {
		joinGroup(groupId: $input) {
			_id
			groupId
			memberId
			groupMemberRole
			joinDate
			createdAt
			updatedAt
		}
	}
`;

export const LEAVE_GROUP = gql`
	mutation LeaveGroup($input: String!) {
		leaveGroup(groupId: $input) {
			_id
			groupId
			memberId
			groupMemberRole
			joinDate
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_GROUP_MEMBER_ROLE = gql`
	mutation UpdateGroupMemberRole($input: GroupMemberUpdateInput!) {
		updateGroupMemberRole(input: $input) {
			_id
			groupId
			memberId
			groupMemberRole
			joinDate
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_GROUP = gql`
	mutation DeleteGroup($input: String!) {
		deleteGroup(groupId: $input) {
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

export const CREATE_EVENT = gql`
	mutation CreateEvent($input: EventInput!) {
		createEvent(input: $input) {
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

export const UPDATE_EVENT = gql`
	mutation UpdateEvent($input: EventUpdateInput!) {
		updateEvent(input: $input) {
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

export const ATTEND_EVENT = gql`
	mutation AttendEvent($input: String!) {
		attendEvent(eventId: $input) {
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

export const WITHDRAW_EVENT = gql`
	mutation WithdrawEvent($input: String!) {
		withdrawEvent(eventId: $input) {
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

/**************************
 *         COMMENT         *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
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
	}
`;
