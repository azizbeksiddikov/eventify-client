import { GroupCategory } from '@/libs/enums/group.enum';
import { Member, TotalCounter } from '@/libs/types/member/member';
import { MeLiked } from '@/libs/types/like/like';
import { GroupMember } from '@/libs/types/groupMembers/groupMember';
import { Event } from '@/libs/types/event/event';

export interface MeJoined {
	memberId: string;
	groupMemberRole: string;
	joinDate: Date;
	meJoined: boolean;
}

export interface Group {
	_id: string;
	groupName: string;
	groupDesc: string;
	groupImage: string;
	memberId: string;
	groupCategories: GroupCategory[];
	groupViews: number;
	groupLikes: number;
	memberCount: number;
	eventsCount: number;
	createdAt: Date;
	updatedAt: Date;

	// from aggregate
	memberData?: Member;
	groupModerators?: GroupMember[];
	similarGroups?: Group[];
	groupUpcomingEvents?: Event[];

	meLiked?: MeLiked[];
	meJoined?: MeJoined[];
}

export interface Groups {
	list: Group[];
	metaCounter: TotalCounter[];
}
