import { GroupCategory } from '../../enums/group.enum';
import { Direction } from '../../enums/common.enum';

export interface GroupInput {
	groupLink: string;
	groupName: string;
	groupDesc: string;
	groupImage: string;
	groupCategories?: GroupCategory[];
}

export interface GroupsSearch {
	text?: string;
	groupCategories?: GroupCategory[];
}

export interface GroupsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: GroupsSearch;
}
