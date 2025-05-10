import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { BellIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/libs/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/libs/components/ui/dropdown-menu';
import { ScrollArea } from '@/libs/components/ui/scroll-area';
import { Badge } from '@/libs/components/ui/badge';
import { Separator } from '@/libs/components/ui/separator';

import { GET_NOTIFICATIONS } from '@/apollo/user/query';
import { READ_ALL_NOTIFICATIONS, UPDATE_NOTIFICATION } from '@/apollo/user/mutation';
import { NotificationsInquiry } from '@/libs/types/notification/notification.input';
import { Direction } from '@/libs/enums/common.enum';
import { NotificationType } from '@/libs/enums/notification.enum';
import { Notification } from '@/libs/types/notification/notification';
import { useEffect, useState } from 'react';

const defaultNotificationsInquiry: NotificationsInquiry = {
	page: 1,
	limit: 15,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		isRead: false,
	},
};

const getNotificationText = (notification: Notification, t: (key: string) => string) => {
	switch (notification.notificationType) {
		case NotificationType.CREATE_EVENT:
			return t('New event was created');
		case NotificationType.JOIN_EVENT:
			return t(`${notification.memberData?.memberFullName} joined your event`);
		case NotificationType.LIKE_EVENT:
			return t(`${notification.memberData?.memberFullName} liked your event`);
		case NotificationType.COMMENT_EVENT:
			return t(`${notification.memberData?.memberFullName} commented on your event`);
		case NotificationType.JOIN_GROUP:
			return t(`${notification.memberData?.memberFullName} joined your group`);
		case NotificationType.LIKE_GROUP:
			return t(`${notification.memberData?.memberFullName} liked your group`);
		case NotificationType.COMMENT_GROUP:
			return t(`${notification.memberData?.memberFullName} commented on your group`);
		case NotificationType.LIKE_MEMBER:
			return t(`${notification.memberData?.memberFullName} liked your profile`);
		case NotificationType.COMMENT_MEMBER:
			return t(`${notification.memberData?.memberFullName} commented on your profile`);
		case NotificationType.FOLLOW_MEMBER:
			return t(`${notification.memberData?.memberFullName} followed you`);
		default:
			return t('New notification');
	}
};

export const NotificationDropdown = () => {
	const { t } = useTranslation('common');
	const router = useRouter();

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);

	/** APOLLO REQUESTS */
	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const [readAllNotifications] = useMutation(READ_ALL_NOTIFICATIONS);

	const { data: notificationsData, refetch: refetchNotifications } = useQuery(GET_NOTIFICATIONS, {
		variables: {
			input: defaultNotificationsInquiry,
		},
		fetchPolicy: 'cache-and-network',
	});

	/** LIFECYCLES */
	useEffect(() => {
		if (notificationsData) {
			setNotifications(notificationsData.getNotifications.list || []);
			setUnreadCount(notificationsData.getNotifications.metaCounter[0]?.total || 0);
		}
	}, [notificationsData]);

	const readNotificationHandler = async (notification: Notification, e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			await updateNotification({
				variables: {
					input: {
						_id: notification._id,
						isRead: true,
					},
				},
			});
			if (notification.notificationLink) {
				router.push(notification.notificationLink);
			}
		} catch (err) {
			console.error('Failed to mark notification as read:', err);
		}
	};

	const readAllNotificationsHandler = async () => {
		try {
			await readAllNotifications();
			await refetchNotifications();
		} catch (err) {
			console.error('Failed to mark all notifications as read:', err);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<BellIcon className="h-4 w-4" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
						>
							{unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-80">
				<div className="flex items-center justify-between px-4 py-2">
					<h4 className="text-sm font-medium">{t('Notifications')}</h4>
					<Badge variant="secondary" className="text-xs">
						{unreadCount} {t('unread')}
					</Badge>
					<Button
						variant="default"
						size="sm"
						className="h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
						onClick={readAllNotificationsHandler}
						disabled={unreadCount === 0}
					>
						{t('Read All')}
					</Button>
				</div>
				<Separator />
				<ScrollArea className="min-h-60">
					{notifications.length > 0 ? (
						notifications.map((notification: Notification) => (
							<DropdownMenuItem
								key={notification._id}
								className={`flex flex-col items-start p-4 cursor-pointer ${!notification.isRead ? 'bg-accent/50' : ''}`}
							>
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium">{getNotificationText(notification, t)}</span>
										<span className="text-xs text-muted-foreground">
											{format(new Date(notification.createdAt), 'MMM d, hh:mm')}
										</span>
									</div>
									{!notification.isRead && (
										<Button
											variant="ghost"
											size="sm"
											className="h-6 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
											onClick={(e) => readNotificationHandler(notification, e)}
										>
											{t('Read')}
										</Button>
									)}
								</div>
							</DropdownMenuItem>
						))
					) : (
						<div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
							{t('No notifications')}
						</div>
					)}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
