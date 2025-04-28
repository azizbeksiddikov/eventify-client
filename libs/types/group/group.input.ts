import { GroupCategory } from '../../enums/group.enum';
import { Direction } from '../../enums/common.enum';

export enum GroupCategory {
	TECHNOLOGY = 'TECHNOLOGY',
	BUSINESS = 'BUSINESS',
	ART = 'ART',
	MUSIC = 'MUSIC',
	SPORTS = 'SPORTS',
	FOOD = 'FOOD',
	EDUCATION = 'EDUCATION',
	HEALTH = 'HEALTH',
	OTHER = 'OTHER',
}

export interface GroupInput {
	id: string;
	name: string;
	description: string;
	image: string;
	category: GroupCategory;
	organizerId: string;
	membersCount: number;
	eventsCount: number;
	createdAt: Date;
	updatedAt: Date;
	socialMedia?: {
		facebook?: string;
		twitter?: string;
		instagram?: string;
		linkedin?: string;
	};
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
