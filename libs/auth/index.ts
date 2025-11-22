import { jwtDecode } from "jwt-decode";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { userVar } from "@/apollo/store";

import { LOGIN, SIGN_UP } from "@/apollo/user/mutation";
import { CustomJwtPayload } from "@/libs/types/customJwtPayload";
import { Message } from "@/libs/enums/common.enum";
import { MemberType } from "@/libs/enums/member.enum";

/**
 * Creates a standalone Apollo Client for authentication operations
 * Used for login/signup before the main app client is available
 */
function createAuthApolloClient() {
	return new ApolloClient({
		link: new HttpLink({
			uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
		}),
		cache: new InMemoryCache(),
	});
}

/**
 * Gets JWT token from localStorage
 * @returns Token string if exists and valid, undefined otherwise
 */
export function getJwtToken(): string | undefined {
	if (typeof window === "undefined") return undefined;

	try {
		const token = localStorage.getItem("accessToken");
		if (!token || token === "undefined" || token === "null") {
			return undefined;
		}

		// Basic JWT format validation (has 3 parts separated by dots)
		if (token.split(".").length !== 3) {
			console.warn("Invalid JWT format detected, clearing token");
			deleteStorage();
			return undefined;
		}

		return token;
	} catch (error) {
		console.error("Error reading token from localStorage:", error);
		return undefined;
	}
}

/**
 * Saves JWT token to localStorage
 * @param token - JWT token string
 */
export function setJwtToken(token: string) {
	if (typeof window === "undefined") return;

	try {
		if (!token || token === "undefined" || token === "null") {
			console.warn("Attempted to set invalid token");
			return;
		}
		localStorage.setItem("accessToken", token);
	} catch (error) {
		console.error("Error saving token to localStorage:", error);
	}
}

/**
 * Checks if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid, false otherwise
 */
export function isTokenExpired(token: string): boolean {
	try {
		const decoded = jwtDecode<CustomJwtPayload>(token);
		if (!decoded.exp) return true;

		// JWT exp is in seconds, Date.now() is in milliseconds
		const currentTime = Date.now() / 1000;
		return decoded.exp < currentTime;
	} catch (error) {
		console.warn("Error decoding token:", error);
		return true;
	}
}

/**
 * Gets a valid, non-expired JWT token
 * @returns Token string if exists and not expired, undefined otherwise
 */
export function getValidJwtToken(): string | undefined {
	const token = getJwtToken();
	if (!token) return undefined;

	if (isTokenExpired(token)) {
		console.warn("Token is expired, clearing storage");
		deleteStorage();
		deleteUserInfo();
		return undefined;
	}

	return token;
}

/**
 * Authenticates user and stores JWT token
 * @param username - User's username
 * @param memberPassword - User's password
 * @throws Error if login fails
 */
export const logIn = async (username: string, memberPassword: string): Promise<void> => {
	try {
		// Validate inputs
		if (!username || !memberPassword) throw new Error("Username and password are required");

		const { jwtToken } = await requestJwtToken({ username, memberPassword });

		if (!jwtToken) throw new Error("No token received from server");

		// Validate token before storing
		if (isTokenExpired(jwtToken)) {
			throw new Error("Received expired token from server");
		}

		updateStorage({ jwtToken });
		updateUserInfo(jwtToken);
	} catch (err) {
		console.error("Login error:", err);
		deleteStorage();
		deleteUserInfo();

		// Provide more specific error messages
		if (err instanceof Error) {
			if (err.message.includes("Unauthorized") || err.message.includes("Invalid credentials")) {
				throw new Error("Invalid username or password");
			}
			throw err;
		}
		throw new Error(Message.LOGIN_FAILED);
	}
};

const requestJwtToken = async ({
	username,
	memberPassword,
}: {
	username: string;
	memberPassword: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = createAuthApolloClient();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { username, memberPassword } },
			fetchPolicy: "network-only",
		});

		const accessToken = (result?.data as { login?: { accessToken?: string } })?.login?.accessToken;

		if (!accessToken) throw new Error("No access token in response");

		return { jwtToken: accessToken };
	} catch (err: unknown) {
		console.error("JWT token request error:", err);
		// Extract meaningful error message from GraphQL errors
		if (err && typeof err === "object" && "graphQLErrors" in err) {
			const graphQLErrors = (err as { graphQLErrors: Array<{ message: string }> }).graphQLErrors;
			if (graphQLErrors && graphQLErrors.length > 0) {
				throw new Error(graphQLErrors[0].message);
			}
		}
		if (err instanceof Error) {
			throw new Error(err.message || "Failed to authenticate");
		}
		throw new Error("Failed to authenticate");
	}
};

/**
 * Registers a new user and stores JWT token
 * @param username - User's username
 * @param memberPassword - User's password
 * @param memberEmail - User's email
 * @param memberFullName - User's full name
 * @param memberType - User's member type
 * @throws Error if signup fails
 */
export const signUp = async (
	username: string,
	memberPassword: string,
	memberEmail: string,
	memberFullName: string,
	memberType: MemberType,
): Promise<void> => {
	try {
		// Validate inputs
		if (!username || !memberPassword || !memberEmail || !memberFullName) {
			throw new Error("All fields are required");
		}

		const { jwtToken } = await requestSignUpJwtToken({
			username,
			memberPassword,
			memberEmail,
			memberFullName,
			memberType,
		});

		if (!jwtToken) throw new Error("No token received from server");

		// Validate token before storing
		if (isTokenExpired(jwtToken)) {
			throw new Error("Received expired token from server");
		}

		updateStorage({ jwtToken });
		updateUserInfo(jwtToken);
	} catch (err: unknown) {
		console.error("Signup error:", err);
		deleteStorage();
		deleteUserInfo();

		// Provide more specific error messages
		if (err instanceof Error) throw err;

		throw new Error("Failed to create account");
	}
};

const requestSignUpJwtToken = async ({
	username,
	memberPassword,
	memberEmail,
	memberFullName,
	memberType,
}: {
	username: string;
	memberPassword: string;
	memberEmail: string;
	memberFullName: string;
	memberType: MemberType;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = createAuthApolloClient();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: { username, memberPassword, memberEmail, memberFullName, memberType },
			},
			fetchPolicy: "network-only",
		});

		const accessToken = (result?.data as { signup?: { accessToken?: string } })?.signup?.accessToken;

		if (!accessToken) throw new Error("No access token in response");

		return { jwtToken: accessToken };
	} catch (err: unknown) {
		console.error("Signup token request error:", err);
		// Extract meaningful error message from GraphQL errors
		if (err && typeof err === "object" && "graphQLErrors" in err) {
			const graphQLErrors = (err as { graphQLErrors: Array<{ message: string }> }).graphQLErrors;
			if (graphQLErrors && graphQLErrors.length > 0) {
				throw new Error(graphQLErrors[0].message);
			}
		}
		if (err instanceof Error) {
			throw new Error(err.message || "Failed to create account");
		}
		throw new Error("Failed to create account");
	}
};

/**
 * Stores JWT token and updates storage timestamp
 * @param jwtToken - JWT token to store
 */
export const updateStorage = ({ jwtToken }: { jwtToken: string }) => {
	if (typeof window === "undefined") return;

	try {
		setJwtToken(jwtToken);
		window.localStorage.setItem("login", Date.now().toString());
	} catch (error) {
		console.error("Error updating storage:", error);
	}
};

/**
 * Decodes JWT token and updates user info in Apollo cache
 * @param jwtToken - JWT token to decode
 * @returns true if successful, false otherwise
 */
export const updateUserInfo = (jwtToken: string): boolean => {
	if (!jwtToken) {
		console.warn("Cannot update user info: no token provided");
		return false;
	}

	try {
		const claims = jwtDecode<CustomJwtPayload>(jwtToken);

		// Validate essential claims
		if (!claims._id || !claims.username) {
			console.error("Invalid token: missing essential claims");
			return false;
		}

		userVar({
			_id: claims._id ?? "",
			username: claims.username ?? "",
			memberEmail: claims.memberEmail ?? "",
			memberPhone: claims.memberPhone ?? "",
			memberFullName: claims.memberFullName ?? "",
			memberType: claims.memberType ?? "",
			emailVerified: claims.emailVerified ?? false,
			memberDesc: claims.memberDesc ?? "",
			memberImage: claims.memberImage ?? "",
			memberPoints: claims.memberPoints ?? 0,
			memberLikes: claims.memberLikes ?? 0,
			memberFollowings: claims.memberFollowings ?? 0,
			memberFollowers: claims.memberFollowers ?? 0,
			memberViews: claims.memberViews ?? 0,
			eventOrganizedCount: claims.eventOrganizedCount ?? 0,
			memberStatus: claims.memberStatus ?? "",
			memberGroups: claims.memberGroups ?? 0,
			memberEvents: claims.memberEvents ?? 0,
			memberRank: claims.memberRank ?? 0,
			createdAt: claims.createdAt ?? new Date(),
			updatedAt: claims.updatedAt ?? new Date(),
		});

		return true;
	} catch (error) {
		console.error("Error decoding JWT token:", error);
		return false;
	}
};

/**
 * Logs out user by clearing storage and user info
 * @param redirect - Whether to reload the page after logout (default: true)
 */
export const logOut = (redirect: boolean = true) => {
	try {
		deleteStorage();
		deleteUserInfo();

		if (redirect && typeof window !== "undefined") {
			// Use router if available, otherwise reload
			window.location.href = "/auth/login";
		}
	} catch (error) {
		console.error("Error during logout:", error);
		// Fallback: force reload to clear everything
		if (typeof window !== "undefined") {
			window.location.reload();
		}
	}
};

/**
 * Removes JWT token and related data from localStorage
 */
const deleteStorage = () => {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem("accessToken");
		window.localStorage.setItem("logout", Date.now().toString());
	} catch (error) {
		console.error("Error deleting storage:", error);
	}
};

/**
 * Resets user info in Apollo cache to default empty state
 */
const deleteUserInfo = () => {
	try {
		userVar({
			_id: "",
			username: "",
			memberEmail: "",
			memberPhone: "",
			memberFullName: "",
			memberType: "",
			memberStatus: "",
			emailVerified: false,
			memberDesc: "",
			memberImage: "",
			memberPoints: 0,
			memberLikes: 0,
			memberFollowings: 0,
			memberFollowers: 0,
			memberViews: 0,
			eventOrganizedCount: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			memberGroups: 0,
			memberEvents: 0,
			memberRank: 0,
		});
	} catch (error) {
		console.error("Error deleting user info:", error);
	}
};
