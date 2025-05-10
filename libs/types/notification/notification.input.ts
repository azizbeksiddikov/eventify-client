import { Direction } from '@/libs/enums/common.enum';
import { NotificationType } from '@/libs/enums/notification.enum';

export interface NISearch {
	receiverId?: string;
	notificationType?: NotificationType;
	isRead?: boolean;
}

export interface NotificationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: NISearch;
}
