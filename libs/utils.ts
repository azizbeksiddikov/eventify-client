import numeral from "numeral";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Message } from "@/libs/enums/common.enum";
import { smallError, smallInfo, smallSuccess } from "@/libs/alert";
import { TFunction } from "i18next";
import { gql } from "@apollo/client";
import { NEXT_APP_API_URL } from "@/libs/config";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Generate SVG placeholder image with custom text
 * Uses theme colors for a consistent look with better styling
 * Font size scales with image dimensions for better readability
 */
function generatePlaceholder(text: string, width: number, height: number, bgColor: string, textColor: string): string {
	// Calculate font size based on dimensions - use ~60% of the smaller dimension
	// This ensures text remains readable even when the SVG is scaled down for small avatars
	// Ensure minimum font size of 16px and maximum of 120px for readability
	const minDimension = Math.min(width, height);
	const calculatedFontSize = Math.max(16, Math.min(120, Math.round(minDimension * 0.6)));

	const svg = `
		<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="grad-${text}" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
					<stop offset="100%" style="stop-color:${bgColor};stop-opacity:0.85" />
				</linearGradient>
			</defs>
			<rect width="100%" height="100%" fill="url(#grad-${text})"/>
			<text 
				x="50%" 
				y="50%" 
				dominant-baseline="middle" 
				text-anchor="middle" 
				font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" 
				font-size="${calculatedFontSize}" 
				font-weight="600"
				fill="${textColor}"
				opacity="0.9"
			>${text}</text>
		</svg>
	`;
	return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Placeholder images for different types
 * Colors match the theme's primary purple/violet palette
 */
const PLACEHOLDER_IMAGES = {
	event: generatePlaceholder("Event", 600, 400, "#9333ea", "#faf5ff"), // Purple gradient
	group: generatePlaceholder("Group", 600, 400, "#7c3aed", "#f5f3ff"), // Violet gradient
	member: generatePlaceholder("Member", 400, 400, "#8b5cf6", "#faf5ff"), // Purple-violet gradient
	other: generatePlaceholder("Other", 400, 400, "#8b5cf6", "#faf5ff"), // Purple-violet gradient
};

/**
 * Get the proper image URL for an event based on its origin
 */
export function getImageUrl(imageUrl: string, type: "event" | "group" | "member" | "other", origin?: string): string {
	if (!imageUrl) return PLACEHOLDER_IMAGES[type];

	// If origin is not 'internal', use the original image URL directly
	if (type === "event" && origin && origin !== "internal") return imageUrl;

	console.log("imageUrl", `${NEXT_APP_API_URL}/${imageUrl}`);
	return `${NEXT_APP_API_URL}/${imageUrl}`;
}

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format("0,0") != "0" ? numeral(value).format("0,0") : "";
};

/**
 * Timezone utilities for Seoul (UTC+9)
 */
const SEOUL_TIMEZONE = "Asia/Seoul";

/**
 * Convert any date to Seoul timezone
 */
export const toSeoulDate = (date: string | Date): Date => {
	const d = new Date(date);
	// Return date in Seoul timezone
	return new Date(d.toLocaleString("en-US", { timeZone: SEOUL_TIMEZONE }));
};

/**
 * Format date in Seoul timezone
 * example: "December 15, 2025"
 */
export const formatSeoulDate = (
	date: string | Date,
	options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	},
): string => {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", { ...options, timeZone: SEOUL_TIMEZONE });
};

/**
 * Format time in Seoul timezone
 * example: "10:00"
 */
export const formatSeoulTime = (date: string | Date, format: "12" | "24" = "24"): string => {
	const d = new Date(date);
	return d.toLocaleTimeString("en-US", {
		timeZone: SEOUL_TIMEZONE,
		hour: "2-digit",
		minute: "2-digit",
		hour12: format === "12",
	});
};

/**
 * Format date and time in Seoul timezone
 * example: "December 15, 2025 10:00"
 */
export const formatSeoulDateTime = (date: string | Date): string => {
	const d = new Date(date);
	const dateStr = formatSeoulDate(d);
	const timeStr = formatSeoulTime(d);
	return `${dateStr} ${timeStr}`;
};

export const formatPhoneNumber = (value: string) => {
	// Remove all non-digit characters
	const numbers = value.replace(/\D/g, "");

	// Format the number as XXX-XXXX-XXXX
	// 012-3456-78910
	if (numbers.length <= 3) {
		return numbers;
	} else if (numbers.length <= 7) {
		return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
	} else {
		return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
	}
};

export const readDate = (date: Date): string => {
	const seoulDate = new Date(date.toLocaleString("en-US", { timeZone: SEOUL_TIMEZONE }));
	return `${seoulDate.getFullYear()}-${(seoulDate.getMonth() + 1).toString().padStart(2, "0")}-${seoulDate.getDate().toString().padStart(2, "0")}`;
};

export const parseDate = (dateStr: string | undefined): Date | undefined => {
	if (!dateStr) return undefined;
	const parts = dateStr.split("-").map(Number);
	if (parts.length !== 3 || parts.some(isNaN)) return undefined;

	// Return a date at noon UTC to avoid timezone shifting issues when converting back to string or sending to API
	// 12:00 UTC is safe for all timezones between UTC-12 and UTC+12 to stay on the same calendar day
	return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12, 0, 0));
};

export const likeEvent = async (
	memberId: string,
	likeRefId: string,
	likeTargetEvent: (options?: any) => Promise<any>,
) => {
	try {
		if (!likeRefId || likeRefId === "") return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetEvent({ variables: { input: likeRefId } });
	} catch (err: any) {
		smallError(err.message);
	}
};

export const likeMember = async (
	memberId: string,
	likeRefId: string,
	likeTargetMember: (options?: any) => Promise<any>,
) => {
	try {
		if (!likeRefId || likeRefId === "") return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetMember({ variables: { input: likeRefId } });
	} catch (err: any) {
		smallError(err.message);
	}
};

export const likeGroup = async (
	memberId: string,
	likeRefId: string,
	likeTargetGroup: (options?: any) => Promise<any>,
) => {
	try {
		if (!likeRefId || likeRefId === "") return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetGroup({ variables: { input: likeRefId } });
	} catch (err: any) {
		smallError(err.message);
	}
};

// Subscribe/Unsubscribe
export const followMember = async (
	memberId: string,
	followRefId: string,
	followTargetMember: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!followRefId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await followTargetMember({
			variables: { input: followRefId },
		});

		await smallSuccess(t("member_subscribed_successfully"));
	} catch (err: any) {
		smallError(err.message);
		console.log("ERROR, subscribeHandler:", err.message);
	}
};

export const unfollowMember = async (
	memberId: string,
	followRefId: string,
	unfollowTargetMember: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!followRefId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await unfollowTargetMember({
			variables: { input: followRefId },
		});

		await smallInfo(t("member_unsubscribed_successfully"));
	} catch (err: any) {
		smallError(err.message);
		console.log("ERROR, unsubscribeHandler:", err.message);
	}
};

// Join/Leave group
export const joinGroup = async (
	memberId: string,
	groupId: string,
	joinTargetGroup: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!groupId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await joinTargetGroup({
			variables: { input: groupId },
		});

		await smallSuccess(t("group_joined_successfully"));
	} catch (err: any) {
		smallError(err.message);
		console.log("ERROR, joinGroupHandler:", err.message);
	}
};

export const leaveGroup = async (
	memberId: string,
	groupId: string,
	leaveTargetGroup: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!groupId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await leaveTargetGroup({
			variables: { input: groupId },
		});

		await smallSuccess(t("group_left_successfully"));
	} catch (err: any) {
		smallError(err.message);
		console.log("ERROR, leaveGroupHandler:", err.message);
	}
};
