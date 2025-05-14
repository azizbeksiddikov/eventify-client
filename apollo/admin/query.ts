import { gql } from '@apollo/client';

/**************************
 *         MEMBER          *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         GROUP           *
 *************************/

export const GET_ALL_GROUPS_BY_ADMIN = gql`
	query GetAllGroupsByAdmin($input: GroupsInquiry!) {
		getAllGroupsByAdmin(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         EVENT           *
 *************************/

export const GET_ALL_EVENTS_BY_ADMIN = gql`
	query GetAllEventsByAdmin($input: EventsInquiry!) {
		getAllEventsByAdmin(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FAQ             *
 *************************/

export const GET_ALL_FAQS_BY_ADMIN = gql`
	query GetAllFaqsByAdmin {
		getAllFaqsByAdmin {
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

export const GET_ALL_FAQS = gql`
	query GetAllFaqs {
		getAllFaqs {
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
