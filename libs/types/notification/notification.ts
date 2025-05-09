import { NotificationType } from '@/libs/enums/notificatoin.enum';
import { TotalCounter } from '@/libs/types/member/member';

export interface Notification {
	_id: string;
	senderId: string;
	receiverId: string;
	notificationRefId: string;
	notificationType: NotificationType;
	isRead: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notifications {
	list: Notification[];
	metaCounter: TotalCounter[];
}
