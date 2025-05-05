import { GroupCategory } from '@/libs/enums/group.enum';

export interface GroupUpdateInput {
	_id: string;
	groupName?: string;
	groupDesc?: string;
	groupImage?: string;
	groupCategories?: GroupCategory[];
}
