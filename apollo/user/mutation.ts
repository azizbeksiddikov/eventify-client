import { gql } from '@apollo/client';

// Member

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
