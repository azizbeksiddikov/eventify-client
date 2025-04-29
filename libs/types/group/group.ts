import { GroupCategory } from '@/libs/enums/group.enum';
import { TotalCounter } from '../member/member';

export interface Group {
	_id: string;
	groupLink: string;
	groupName: string;
	groupDesc: string;
	groupImage: string;
	groupOwnerId: string;
	groupCategories: GroupCategory[];
	groupViews: number;
	groupLikes: number;
	memberCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Groups {
	list: Group[];
	metaCounter: TotalCounter[];
}
