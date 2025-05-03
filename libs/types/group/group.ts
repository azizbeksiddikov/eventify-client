import { GroupCategory } from '@/libs/enums/group.enum';
import { TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

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
	meOwner?: boolean;
	meLiked?: MeLiked[];
	meJoined?: MeJoined[];
}

export interface Groups {
	list: Group[];
	metaCounter: TotalCounter[];
}
