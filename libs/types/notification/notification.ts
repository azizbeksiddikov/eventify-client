import { NotificationType } from '@/libs/enums/notification.enum';
import { Member, TotalCounter } from '@/libs/types/member/member';

export interface Notification {
	_id: string;
	memberId: string;
	receiverId: string;
	notificationLink?: string;
	notificationType: NotificationType;
	isRead: boolean;
	createdAt: Date;
	updatedAt: Date;

	memberData?: Member;
}

export interface Notifications {
	list: Notification[];
	metaCounter: TotalCounter[];
}
