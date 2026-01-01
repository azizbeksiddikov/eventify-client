"use client";

import { useTranslation } from "next-i18next";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { BellIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/libs/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";
import { ScrollArea } from "@/libs/components/ui/scroll-area";
import { Badge } from "@/libs/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/libs/components/ui/avatar";
import { cn } from "@/libs/utils";

import { GET_NOTIFICATIONS } from "@/apollo/user/query";
import { READ_ALL_NOTIFICATIONS, UPDATE_NOTIFICATION } from "@/apollo/user/mutation";
import { NotificationsInquiry } from "@/libs/types/notification/notification.input";
import { Direction } from "@/libs/enums/common.enum";
import { NotificationType } from "@/libs/enums/notification.enum";
import { Notification } from "@/libs/types/notification/notification";
import { useEffect, useState } from "react";

const defaultNotificationsInquiry: NotificationsInquiry = {
	page: 1,
	limit: 15,
	sort: "createdAt",
	direction: Direction.DESC,
	search: {
		isRead: false,
	},
};

const getNotificationText = (notification: Notification, t: (key: string) => string) => {
	const memberName = notification.memberData?.memberFullName || "";
	switch (notification.notificationType) {
		case NotificationType.CREATE_EVENT:
			return t("new_event_was_created");
		case NotificationType.JOIN_EVENT:
			return `${memberName} ${t("joined_your_event")}`;
		case NotificationType.LIKE_EVENT:
			return `${memberName} ${t("liked_your_event")}`;
		case NotificationType.COMMENT_EVENT:
			return `${memberName} ${t("commented_on_your_event")}`;
		case NotificationType.JOIN_GROUP:
			return `${memberName} ${t("joined_your_group")}`;
		case NotificationType.LIKE_GROUP:
			return `${memberName} ${t("liked_your_group")}`;
		case NotificationType.COMMENT_GROUP:
			return `${memberName} ${t("commented_on_your_group")}`;
		case NotificationType.LIKE_MEMBER:
			return `${memberName} ${t("liked_your_profile")}`;
		case NotificationType.COMMENT_MEMBER:
			return `${memberName} ${t("commented_on_your_profile")}`;
		case NotificationType.FOLLOW_MEMBER:
			return `${memberName} ${t("followed_you")}`;
		default:
			return t("new_notification");
	}
};

interface NotificationDropdownProps {
	isMobile?: boolean;
}

export const NotificationDropdown = ({ isMobile = false }: NotificationDropdownProps) => {
	const { t } = useTranslation("header");
	const router = useRouter();

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	/** APOLLO REQUESTS */
	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const [readAllNotifications] = useMutation(READ_ALL_NOTIFICATIONS);

	const { data: notificationsData, refetch: refetchNotifications } = useQuery(GET_NOTIFICATIONS, {
		variables: {
			input: defaultNotificationsInquiry,
		},
		fetchPolicy: "cache-and-network",
	});

	/** LIFECYCLES */
	useEffect(() => {
		if (notificationsData) {
			setNotifications(notificationsData.getNotifications.list || []);
			setUnreadCount(notificationsData.getNotifications.metaCounter[0]?.total || 0);
		}
	}, [notificationsData]);

	// Close desktop dropdown on resize to mobile
	useEffect(() => {
		if (isMobile) return;

		const mediaQuery = window.matchMedia("(min-width: 768px)");
		const handleChange = (e: MediaQueryListEvent) => {
			if (!e.matches) {
				setIsOpen(false);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [isMobile]);

	const readNotificationHandler = async (notification: Notification, e: React.MouseEvent) => {
		e.stopPropagation();
		try {
			if (!notification.isRead) {
				await updateNotification({
					variables: {
						input: {
							_id: notification._id,
							isRead: true,
						},
					},
				});
			}

			if (notification.notificationLink) {
				setIsOpen(false);
				router.push(notification.notificationLink);
			}
		} catch (err) {
			console.error("Failed to mark notification as read:", err);
		}
	};

	const readAllNotificationsHandler = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await readAllNotifications();
			await refetchNotifications();
		} catch (err) {
			console.error("Failed to mark all notifications as read:", err);
		}
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative group">
					<BellIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
						>
							{unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={10} className="w-[380px] max-w-[calc(100vw-1rem)] p-0 z-[100] mr-4">
				<div className="flex items-center justify-between px-4 py-3 border-b">
					<div className="flex items-center gap-2">
						<h4 className="text-sm font-semibold">{t("notifications")}</h4>
						{unreadCount > 0 && (
							<Badge variant="secondary" className="text-xs px-1.5 py-0 rounded-sm h-5">
								{unreadCount} {t("new")}
							</Badge>
						)}
					</div>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-primary"
							onClick={readAllNotificationsHandler}
						>
							{t("read_all")}
						</Button>
					)}
				</div>
				<ScrollArea className="h-[400px]">
					{notifications.length > 0 ? (
						<div className="flex flex-col py-2">
							{notifications.map((notification: Notification) => (
								<DropdownMenuItem
									key={notification._id}
									className={cn(
										"flex items-start gap-3 px-4 py-3 cursor-pointer focus:bg-accent/50",
										!notification.isRead && "bg-accent/20",
									)}
									onClick={(e) => readNotificationHandler(notification, e)}
								>
									<Avatar className="h-9 w-9 border shrink-0">
										<AvatarImage src={notification.memberData?.memberImage} alt="user-avatar" />
										<AvatarFallback className="text-xs">
											{notification.memberData?.memberFullName?.charAt(0).toUpperCase() || "?"}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 min-w-0 space-y-1">
										<p
											className={cn(
												"text-sm leading-snug break-words line-clamp-3",
												!notification.isRead && "font-medium",
											)}
										>
											{getNotificationText(notification, t)}
										</p>
										<p className="text-xs text-muted-foreground">
											{format(new Date(notification.createdAt), "MMM d, HH:mm")}
										</p>
									</div>

									{!notification.isRead && <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
								</DropdownMenuItem>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
							<BellIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
							<p className="text-sm text-muted-foreground">{t("no_notifications")}</p>
						</div>
					)}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
