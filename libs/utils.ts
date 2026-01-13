import numeral from "numeral";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Message } from "@/libs/enums/common.enum";
import { smallError, smallInfo, smallSuccess } from "@/libs/alert";
import { TFunction } from "i18next";
import { ApolloLink } from "@apollo/client";
import { NEXT_APP_API_URL } from "@/libs/config";

// Type for Apollo Client mutation functions
// The mutation function from useMutation accepts options with variables
// Using a flexible type that accepts any function matching the mutation pattern
type MutationFunction<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>> = (
	options: { variables: TVariables } & Record<string, unknown>,
) => Promise<ApolloLink.Result<TData>>;

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

	return `${NEXT_APP_API_URL}/${imageUrl}`;
}

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format("0,0") != "0" ? numeral(value).format("0,0") : "";
};

const SEOUL_TIMEZONE = "Asia/Seoul";

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

/**
 * Format price with currency support
 * @param price - The price to format
 * @param currency - Optional currency code (e.g., 'USD', 'EUR')
 * @param freeText - Optional text to display when price is 0 or free (defaults to "Free")
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency?: string, freeText: string = "Free"): string => {
	if (!price || price === 0) return freeText;
	if (currency) {
		try {
			return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(price);
		} catch {
			// ignore invalid currency codes
		}
	}
	return String(price);
};

/**
 * Format a Date object to YYYY-MM-DD string using local timezone
 * Use this for date input values to avoid timezone shifting issues
 */
export const formatDateForInput = (date: Date | null | undefined): string => {
	if (!date) return "";
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

/**
 * Parse a YYYY-MM-DD date string to Date object in local timezone
 * Use this when reading date input values to avoid timezone shifting issues
 */
export const parseDateFromInput = (dateStr: string | null | undefined): Date | undefined => {
	if (!dateStr) return undefined;
	const parts = dateStr.split("-").map(Number);
	if (parts.length !== 3 || parts.some(isNaN)) return undefined;

	// Create date in local timezone (not UTC) to avoid day shifting
	return new Date(parts[0], parts[1] - 1, parts[2]);
};

/**
 * Get today's date as YYYY-MM-DD string in local timezone
 * Use this for date input min attributes
 */
export const getTodayDateString = (): string => {
	const today = new Date();
	return formatDateForInput(today);
};

export const likeEvent = async (
	memberId: string,
	likeRefId: string,
	likeTargetEvent: MutationFunction<unknown, { input: string }>,
) => {
	try {
		if (!likeRefId || likeRefId === "") return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetEvent({ variables: { input: likeRefId } });
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		smallError(errorMessage);
	}
};

export const likeMember = async (
	memberId: string,
	likeRefId: string,
	likeTargetMember: MutationFunction<unknown, { input: string }>,
) => {
	try {
		if (!likeRefId || likeRefId === "") return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetMember({ variables: { input: likeRefId } });
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		smallError(errorMessage);
	}
};

export const likeGroup = async (
	memberId: string,
	likeRefId: string,
	likeTargetGroup: MutationFunction<unknown, { input: string }>,
) => {
	try {
		if (!likeRefId || likeRefId === "") return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetGroup({ variables: { input: likeRefId } });
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		smallError(errorMessage);
	}
};

// Subscribe/Unsubscribe
export const followMember = async (
	memberId: string,
	followRefId: string,
	followTargetMember: MutationFunction<unknown, { input: string }>,
	t: TFunction,
) => {
	try {
		if (!followRefId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await followTargetMember({
			variables: { input: followRefId },
		});

		await smallSuccess(t("member_subscribed_successfully"));
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		smallError(errorMessage);
		console.log("ERROR, subscribeHandler:", errorMessage);
	}
};

export const unfollowMember = async (
	memberId: string,
	followRefId: string,
	unfollowTargetMember: MutationFunction<unknown, { input: string }>,
	t: TFunction,
) => {
	try {
		if (!followRefId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await unfollowTargetMember({
			variables: { input: followRefId },
		});

		await smallInfo(t("member_unsubscribed_successfully"));
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		smallError(errorMessage);
		console.log("ERROR, unsubscribeHandler:", errorMessage);
	}
};

// Join/Leave group
export const joinGroup = async (
	memberId: string,
	groupId: string,
	joinTargetGroup: MutationFunction<unknown, { input: string }>,
	t: TFunction,
) => {
	try {
		if (!groupId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await joinTargetGroup({
			variables: { input: groupId },
		});

		await smallSuccess(t("group_joined_successfully"));
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		smallError(errorMessage);
		console.log("ERROR, joinGroupHandler:", errorMessage);
	}
};

export const leaveGroup = async (
	memberId: string,
	groupId: string,
	leaveTargetGroup: MutationFunction<unknown, { input: string }>,
	t: TFunction,
) => {
	try {
		if (!groupId) return;
		if (!memberId || memberId === "") throw new Error(Message.NOT_AUTHENTICATED);

		await leaveTargetGroup({
			variables: { input: groupId },
		});

		await smallSuccess(t("group_left_successfully"));
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : String(err);
		smallError(errorMessage);
		console.log("ERROR, leaveGroupHandler:", errorMessage);
	}
};

/**
 * Format currency amount with symbol and code
 * @param amount - The amount to format
 * @param currencyCode - Currency code (e.g., 'USD', 'KRW')
 * @param symbol - Currency symbol (e.g., '$', '₩')
 * @returns Formatted currency string (e.g., "$10.00 USD")
 */
export const formatCurrency = (amount: number, currencyCode: string, symbol: string): string => {
	// For currencies like KRW that don't use decimals, don't show decimal places
	const noDecimalCurrencies = ["KRW", "JPY", "VND"];
	const decimals = noDecimalCurrencies.includes(currencyCode) ? 0 : 2;

	return `${symbol}${amount.toFixed(decimals)} ${currencyCode}`;
};

/**
 * Format points with proper thousand separators
 * @param points - The points amount to format
 * @returns Formatted points string (e.g., "1,000 Points")
 */
export const formatPoints = (points: number): string => {
	return `${points.toLocaleString()} Points`;
};

/**
 * Format points with currency conversion
 * @param points - The points amount
 * @param currencyValue - The equivalent currency value
 * @param currencyCode - Currency code (e.g., 'USD', 'KRW')
 * @param symbol - Currency symbol (e.g., '$', '₩')
 * @returns Formatted string showing both points and currency (e.g., "1,000 Points (≈ $10.00 USD)")
 */
export const formatPointsWithCurrency = (
	points: number,
	currencyValue: number,
	currencyCode: string,
	symbol: string,
): string => {
	return `${formatPoints(points)} (≈ ${formatCurrency(currencyValue, currencyCode, symbol)})`;
};
