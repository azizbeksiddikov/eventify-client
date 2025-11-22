import { gql, TypedDocumentNode } from "@apollo/client";
import { Member } from "@/libs/types/member/member";
import { MemberInput, LoginInput } from "@/libs/types/member/member.input";
import { MemberUpdateInput } from "@/libs/types/member/member.update";
import { MeLiked } from "@/libs/types/like/like";
import { MeFollowed } from "@/libs/types/follow/follow";
import { Group } from "@/libs/types/group/group";
import { GroupInput } from "@/libs/types/group/group.input";
import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { GroupMember } from "@/libs/types/groupMembers/groupMember";
import { GroupMemberUpdateInput } from "@/libs/types/groupMembers/groupMember.update";
import { Event } from "@/libs/types/event/event";
import { EventInput, EventRecurrenceInput } from "@/libs/types/event/event.input";
import { EventUpdateInput } from "@/libs/types/event/event.update";
import { EventRecurrence } from "@/libs/types/event/event";
import { Ticket } from "@/libs/types/ticket/ticket";
import { TicketInput } from "@/libs/types/ticket/ticket.input";
import { Comment } from "@/libs/types/comment/comment";
import { CommentInput } from "@/libs/types/comment/comment.input";
import { CommentUpdate } from "@/libs/types/comment/comment.update";
import { Notification } from "@/libs/types/notification/notification";
import { NotificationUpdate } from "@/libs/types/notification/notification.update";

/**************************
 *         MEMBER         *
 *************************/

type SignupMutation = {
	signup: Member & { accessToken: string };
};
type SignupMutationVariables = {
	input: MemberInput;
};
export const SIGN_UP: TypedDocumentNode<SignupMutation, SignupMutationVariables> = gql`
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

type LoginMutation = {
	login: Member & { accessToken: string };
};
type LoginMutationVariables = {
	input: LoginInput;
};
export const LOGIN: TypedDocumentNode<LoginMutation, LoginMutationVariables> = gql`
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

type UpdateMemberMutation = {
	updateMember: Member & { accessToken: string };
};
type UpdateMemberMutationVariables = {
	input: MemberUpdateInput;
};
export const UPDATE_MEMBER: TypedDocumentNode<UpdateMemberMutation, UpdateMemberMutationVariables> = gql`
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
			updatedAt
			accessToken
		}
	}
`;

type LikeTargetMemberMutation = {
	likeTargetMember: Pick<Member, "_id" | "memberLikes" | "updatedAt"> & {
		meLiked?: MeLiked[];
	};
};
type LikeTargetMemberMutationVariables = {
	input: string;
};
export const LIKE_TARGET_MEMBER: TypedDocumentNode<LikeTargetMemberMutation, LikeTargetMemberMutationVariables> = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberLikes
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

type SubscribeMutation = {
	subscribe: Pick<Member, "_id" | "memberFollowers" | "updatedAt"> & {
		meFollowed?: MeFollowed[];
	};
};
type SubscribeMutationVariables = {
	input: string;
};
export const SUBSCRIBE: TypedDocumentNode<SubscribeMutation, SubscribeMutationVariables> = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			memberFollowers
			updatedAt
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

type UnsubscribeMutation = {
	unsubscribe: Pick<Member, "_id" | "memberFollowers" | "updatedAt"> & {
		meFollowed?: MeFollowed[];
	};
};
type UnsubscribeMutationVariables = {
	input: string;
};
export const UNSUBSCRIBE: TypedDocumentNode<UnsubscribeMutation, UnsubscribeMutationVariables> = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			memberFollowers
			updatedAt
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

/**************************
 *         GROUP          *
 *************************/

type CreateGroupMutation = {
	createGroup: Group;
};
type CreateGroupMutationVariables = {
	input: GroupInput;
};
export const CREATE_GROUP: TypedDocumentNode<CreateGroupMutation, CreateGroupMutationVariables> = gql`
	mutation CreateGroup($input: GroupInput!) {
		createGroup(input: $input) {
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
			eventsCount
			meJoined {
				memberId
				groupId
				groupMemberRole
				joinDate
				meJoined
			}
		}
	}
`;

type UpdateGroupMutation = {
	updateGroup: Group;
};
type UpdateGroupMutationVariables = {
	input: GroupUpdateInput;
};
export const UPDATE_GROUP: TypedDocumentNode<UpdateGroupMutation, UpdateGroupMutationVariables> = gql`
	mutation UpdateGroup($input: GroupUpdateInput!) {
		updateGroup(input: $input) {
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
			updatedAt
		}
	}
`;

type JoinGroupMutation = {
	joinTargetGroup: Pick<Group, "_id" | "memberCount" | "updatedAt"> & {
		meJoined?: Group["meJoined"];
	};
};
type JoinGroupMutationVariables = {
	input: string;
};
export const JOIN_GROUP: TypedDocumentNode<JoinGroupMutation, JoinGroupMutationVariables> = gql`
	mutation JoinGroup($input: String!) {
		joinTargetGroup(groupId: $input) {
			_id
			memberCount
			updatedAt
			meJoined {
				memberId
				groupId
				groupMemberRole
				joinDate
				meJoined
			}
		}
	}
`;

type LeaveGroupMutation = {
	leaveTargetGroup: Pick<Group, "_id" | "memberCount" | "updatedAt"> & {
		meJoined?: Group["meJoined"];
	};
};
type LeaveGroupMutationVariables = {
	input: string;
};
export const LEAVE_GROUP: TypedDocumentNode<LeaveGroupMutation, LeaveGroupMutationVariables> = gql`
	mutation LeaveGroup($input: String!) {
		leaveTargetGroup(groupId: $input) {
			_id
			memberCount
			updatedAt
			meJoined {
				memberId
				groupId
				groupMemberRole
				joinDate
				meJoined
			}
		}
	}
`;

type UpdateGroupMemberRoleMutation = {
	updateGroupMemberRole: GroupMember;
};
type UpdateGroupMemberRoleMutationVariables = {
	input: GroupMemberUpdateInput;
};
export const UPDATE_GROUP_MEMBER_ROLE: TypedDocumentNode<
	UpdateGroupMemberRoleMutation,
	UpdateGroupMemberRoleMutationVariables
> = gql`
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

type DeleteGroupMutation = {
	deleteGroup: Pick<Group, "_id" | "groupName" | "updatedAt">;
};
type DeleteGroupMutationVariables = {
	input: string;
};
export const DELETE_GROUP: TypedDocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables> = gql`
	mutation DeleteGroup($input: String!) {
		deleteGroup(groupId: $input) {
			_id
			groupName
			updatedAt
		}
	}
`;

type LikeTargetGroupMutation = {
	likeTargetGroup: Pick<Group, "_id" | "groupLikes" | "updatedAt"> & {
		meLiked?: MeLiked[];
	};
};
type LikeTargetGroupMutationVariables = {
	input: string;
};
export const LIKE_TARGET_GROUP: TypedDocumentNode<LikeTargetGroupMutation, LikeTargetGroupMutationVariables> = gql`
	mutation LikeTargetGroup($input: String!) {
		likeTargetGroup(groupId: $input) {
			_id
			groupLikes
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *         EVENT          *
 *************************/

type CreateEventMutation = {
	createEvent: Event;
};
type CreateEventMutationVariables = {
	input: EventInput;
};
export const CREATE_EVENT: TypedDocumentNode<CreateEventMutation, CreateEventMutationVariables> = gql`
	mutation CreateEvent($input: EventInput!) {
		createEvent(input: $input) {
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
`;

type CreateRecurringEventMutation = {
	createRecurringEvent: EventRecurrence;
};
type CreateRecurringEventMutationVariables = {
	input: EventRecurrenceInput;
};
export const CREATE_RECURRING_EVENT: TypedDocumentNode<
	CreateRecurringEventMutation,
	CreateRecurringEventMutationVariables
> = gql`
	mutation CreateRecurringEvent($input: EventRecurrenceInput!) {
		createRecurringEvent(input: $input) {
			_id
			recurrenceType
			recurrenceInterval
			recurrenceDaysOfWeek
			recurrenceDayOfMonth
			recurrenceEndDate
			eventName
			eventDesc
			eventImages
			eventAddress
			eventCity
			eventCapacity
			eventPrice
			eventCategories
			eventStatus
			eventStartAt
			eventEndAt
			groupId
			memberId
			origin
			isActive
			createdAt
			updatedAt
		}
	}
`;

type UpdateEventByOrganizerMutation = {
	updateEventByOrganizer: Event;
};
type UpdateEventByOrganizerMutationVariables = {
	input: EventUpdateInput;
};
export const UPDATE_EVENT_BY_ORGANIZER: TypedDocumentNode<
	UpdateEventByOrganizerMutation,
	UpdateEventByOrganizerMutationVariables
> = gql`
	mutation UpdateEventByOrganizer($input: EventUpdateInput!) {
		updateEventByOrganizer(input: $input) {
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
`;

type LikeTargetEventMutation = {
	likeTargetEvent: Pick<Event, "_id"> & {
		meLiked?: MeLiked[];
	};
};
type LikeTargetEventMutationVariables = {
	input: string;
};
export const LIKE_TARGET_EVENT: TypedDocumentNode<LikeTargetEventMutation, LikeTargetEventMutationVariables> = gql`
	mutation LikeTargetEvent($input: String!) {
		likeTargetEvent(eventId: $input) {
			_id
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

/**************************
 *         TICKET          *
 *************************/

type CreateTicketMutation = {
	createTicket: Ticket & { eventId: string };
};
type CreateTicketMutationVariables = {
	input: TicketInput;
};
export const CREATE_TICKET: TypedDocumentNode<CreateTicketMutation, CreateTicketMutationVariables> = gql`
	mutation CreateTicket($input: TicketInput!) {
		createTicket(input: $input) {
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
	}
`;

type CancelTicketMutation = {
	cancelTicket: Pick<Ticket, "_id" | "ticketStatus" | "updatedAt">;
};
type CancelTicketMutationVariables = {
	input: string;
};
export const CANCEL_TICKET: TypedDocumentNode<CancelTicketMutation, CancelTicketMutationVariables> = gql`
	mutation CancelTicket($input: String!) {
		cancelTicket(input: $input) {
			_id
			ticketStatus
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT         *
 *************************/

type CreateCommentMutation = {
	createComment: Comment;
};
type CreateCommentMutationVariables = {
	input: CommentInput;
};
export const CREATE_COMMENT: TypedDocumentNode<CreateCommentMutation, CreateCommentMutationVariables> = gql`
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

type UpdateCommentMutation = {
	updateComment: Comment;
};
type UpdateCommentMutationVariables = {
	input: CommentUpdate;
};
export const UPDATE_COMMENT: TypedDocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables> = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			updatedAt
			memberData {
				_id
				username
				memberEmail
				memberFullName
				memberType
				memberImage
				memberStatus
			}
		}
	}
`;

/**************************
 *         NOTIFICATION     *
 *************************/

type UpdateNotificationMutation = {
	updateNotification: Pick<Notification, "_id" | "isRead" | "updatedAt">;
};
type UpdateNotificationMutationVariables = {
	input: NotificationUpdate;
};
export const UPDATE_NOTIFICATION: TypedDocumentNode<UpdateNotificationMutation, UpdateNotificationMutationVariables> =
	gql`
		mutation UpdateNotification($input: NotificationUpdate!) {
			updateNotification(input: $input) {
				_id
				isRead
				updatedAt
			}
		}
	`;

type ReadAllNotificationsMutation = {
	readAllNotifications: boolean;
};
type ReadAllNotificationsMutationVariables = Record<string, never>;
export const READ_ALL_NOTIFICATIONS: TypedDocumentNode<
	ReadAllNotificationsMutation,
	ReadAllNotificationsMutationVariables
> = gql`
	mutation ReadAllNotifications {
		readAllNotifications
	}
`;
