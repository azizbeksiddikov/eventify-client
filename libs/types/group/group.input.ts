import { GroupCategory } from "@/libs/enums/group.enum";
import { Direction } from "@/libs/enums/common.enum";

export interface GroupInput {
	groupName: string;
	groupDesc: string;
	groupImage: string;
	groupCategories: GroupCategory[];
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
