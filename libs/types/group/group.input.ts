import { GroupCategory } from '../../enums/group.enum';
import { Direction } from '../../enums/common.enum';

export interface GroupInput {
	name: string;
	description: string;
	image: string;
	category: GroupCategory;
	organizerId: string;
	membersCount: number;
	eventsCount: number;
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
