import { gql, TypedDocumentNode } from "@apollo/client";
import { Members } from "@/libs/types/member/member";
import { MembersInquiry } from "@/libs/types/member/member.input";
import { Groups } from "@/libs/types/group/group";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { Events } from "@/libs/types/event/event";
import { EventsInquiry } from "@/libs/types/event/event.input";
import { FaqByGroup } from "@/libs/types/faq/faq";

/**************************
 *         MEMBER          *
 *************************/

type GetAllMembersByAdminQuery = {
	getAllMembersByAdmin: Members;
};
type GetAllMembersByAdminQueryVariables = {
	input: MembersInquiry;
};
export const GET_ALL_MEMBERS_BY_ADMIN: TypedDocumentNode<
	GetAllMembersByAdminQuery,
	GetAllMembersByAdminQueryVariables
> = gql`
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

type GetAllGroupsByAdminQuery = {
	getAllGroupsByAdmin: Groups;
};
type GetAllGroupsByAdminQueryVariables = {
	input: GroupsInquiry;
};
export const GET_ALL_GROUPS_BY_ADMIN: TypedDocumentNode<GetAllGroupsByAdminQuery, GetAllGroupsByAdminQueryVariables> =
	gql`
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

type GetAllEventsByAdminQuery = {
	getAllEventsByAdmin: Events;
};
type GetAllEventsByAdminQueryVariables = {
	input: EventsInquiry;
};
export const GET_ALL_EVENTS_BY_ADMIN: TypedDocumentNode<GetAllEventsByAdminQuery, GetAllEventsByAdminQueryVariables> =
	gql`
		query GetAllEventsByAdmin($input: EventsInquiry!) {
			getAllEventsByAdmin(input: $input) {
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

type GetAllFaqsByAdminQuery = {
	getAllFaqsByAdmin: FaqByGroup[];
};
type GetAllFaqsByAdminQueryVariables = Record<string, never>;
export const GET_ALL_FAQS_BY_ADMIN: TypedDocumentNode<GetAllFaqsByAdminQuery, GetAllFaqsByAdminQueryVariables> = gql`
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

type GetAllFaqsQuery = {
	getAllFaqs: FaqByGroup[];
};
type GetAllFaqsQueryVariables = Record<string, never>;
export const GET_ALL_FAQS: TypedDocumentNode<GetAllFaqsQuery, GetAllFaqsQueryVariables> = gql`
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
