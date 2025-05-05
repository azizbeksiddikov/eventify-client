import { gql } from '@apollo/client';

/**************************
 *         MEMBER          *
 *************************/

export const REMOVE_MEMBER_BY_ADMIN = gql`
	mutation RemoveMemberByAdmin($input: String!) {
		removeMemberByAdmin(input: $input) {
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
		}
	}
`;

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdateInput!) {
		updateMemberByAdmin(input: $input) {
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
`;

/**************************
 *         GROUP           *
 *************************/

export const REMOVE_GROUP_BY_ADMIN = gql`
	mutation RemoveGroupByAdmin($input: String!) {
		removeGroupByAdmin(groupId: $input) {
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
`;

export const UPDATE_GROUP_BY_ADMIN = gql`
	mutation UpdateGroupByAdmin($input: GroupUpdateInput!) {
		updateGroupByAdmin(input: $input) {
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
`;
