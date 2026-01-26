import { jwtDecode } from "jwt-decode";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { userVar } from "@/apollo/store";

import { LOGIN, SIGN_UP } from "@/apollo/user/mutation";
import { CustomJwtPayload } from "@/libs/types/customJwtPayload";
import { Message } from "@/libs/enums/common.enum";
import { MemberType } from "@/libs/enums/member.enum";
import { logger } from "@/libs/logger";

/**
 * Creates a standalone Apollo Client for authentication operations
 * Used for login/signup before the main app client is available
 */
function createAuthApolloClient() {
	logger.debug("Creating auth Apollo client", {
		graphqlUrl: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
	});
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
	if (typeof window === "undefined") {
		logger.debug("getJwtToken called on server side");
		return undefined;
	}

	try {
		const token = localStorage.getItem("accessToken");
		if (!token || token === "undefined" || token === "null") {
			logger.debug("No token found in localStorage");
			return undefined;
		}

		// Basic JWT format validation (has 3 parts separated by dots)
		if (token.split(".").length !== 3) {
			logger.warn("Invalid JWT format detected, clearing token", {
				tokenLength: token.length,
			});
			deleteStorage();
			return undefined;
		}

		logger.debug("JWT token retrieved successfully");
		return token;
	} catch (error) {
		logger.error("Error reading token from localStorage", error);
		return undefined;
	}
}

/**
 * Saves JWT token to localStorage
 * @param token - JWT token string
 */
export function setJwtToken(token: string) {
	if (typeof window === "undefined") {
		logger.debug("setJwtToken called on server side");
		return;
	}

	try {
		if (!token || token === "undefined" || token === "null") {
			logger.warn("Attempted to set invalid token");
			return;
		}
		localStorage.setItem("accessToken", token);
		logger.debug("JWT token saved to localStorage");
	} catch (error) {
		logger.error("Error saving token to localStorage", error);
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
		if (!decoded.exp) {
			logger.warn("Token missing expiration claim");
			return true;
		}

		// JWT exp is in seconds, Date.now() is in milliseconds
		const currentTime = Date.now() / 1000;
		const isExpired = decoded.exp < currentTime;
		
		if (isExpired) {
			logger.debug("Token is expired", {
				exp: decoded.exp,
				currentTime,
				timeUntilExpiry: decoded.exp - currentTime,
			});
		}
		
		return isExpired;
	} catch (error) {
		logger.warn("Error decoding token", { error });
		return true;
	}
}

/**
 * Gets a valid, non-expired JWT token
 * @returns Token string if exists and not expired, undefined otherwise
 */
export function getValidJwtToken(): string | undefined {
	const token = getJwtToken();
	if (!token) {
		logger.debug("No token available");
		return undefined;
	}

	if (isTokenExpired(token)) {
		logger.warn("Token is expired, clearing storage");
		deleteStorage();
		deleteUserInfo();
		return undefined;
	}

	logger.debug("Valid JWT token retrieved");
	return token;
}

/**
 * Authenticates user and stores JWT token
 * @param username - User's username
 * @param memberPassword - User's password
 * @throws Error if login fails
 */
export const logIn = async (username: string, memberPassword: string): Promise<void> => {
	logger.logAuth("Login attempt started", { username });
	const startTime = Date.now();

	try {
		// Validate inputs
		if (!username || !memberPassword) {
			logger.logAuth("Login failed: missing credentials", { username });
			throw new Error("Username and password are required");
		}

		logger.logGraphQLOperation("mutation", "LOGIN", { username });
		const { jwtToken } = await requestJwtToken({ username, memberPassword });

		if (!jwtToken) {
			logger.logAuth("Login failed: no token received", { username });
			throw new Error("No token received from server");
		}

		// Validate token before storing
		if (isTokenExpired(jwtToken)) {
			logger.logAuth("Login failed: received expired token", { username });
			throw new Error("Received expired token from server");
		}

		updateStorage({ jwtToken });
		updateUserInfo(jwtToken);
		
		const duration = Date.now() - startTime;
		logger.logAuth("Login successful", { username, duration: `${duration}ms` });
		logger.logGraphQLSuccess("mutation", "LOGIN", duration);
	} catch (err) {
		const duration = Date.now() - startTime;
		logger.logAuth("Login failed", { username, duration: `${duration}ms` });
		logger.logGraphQLError("mutation", "LOGIN", err, { username });
		deleteStorage();
		deleteUserInfo();

		// Provide more specific error messages
		if (err instanceof Error) {
			if (err.message.includes("Unauthorized") || err.message.includes("Invalid credentials")) {
				logger.logAuth("Login failed: invalid credentials", { username });
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
	const startTime = Date.now();

	try {
		logger.debug("Requesting JWT token via GraphQL", { username });
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { username, memberPassword } },
			fetchPolicy: "network-only",
		});

		const accessToken = (result?.data as { login?: { accessToken?: string } })?.login?.accessToken;

		if (!accessToken) {
			logger.error("No access token in response", undefined, { username });
			throw new Error("No access token in response");
		}

		const duration = Date.now() - startTime;
		logger.debug("JWT token received successfully", { username, duration: `${duration}ms` });
		return { jwtToken: accessToken };
	} catch (err: unknown) {
		const duration = Date.now() - startTime;
		logger.error("JWT token request error", err, { username, duration: `${duration}ms` });
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
	logger.logAuth("Signup attempt started", { username, memberEmail, memberType });
	const startTime = Date.now();

	try {
		// Validate inputs
		if (!username || !memberPassword || !memberEmail || !memberFullName) {
			logger.logAuth("Signup failed: missing required fields", { username, memberEmail });
			throw new Error("All fields are required");
		}

		logger.logGraphQLOperation("mutation", "SIGN_UP", { username, memberEmail, memberType });
		const { jwtToken } = await requestSignUpJwtToken({
			username,
			memberPassword,
			memberEmail,
			memberFullName,
			memberType,
		});

		if (!jwtToken) {
			logger.logAuth("Signup failed: no token received", { username, memberEmail });
			throw new Error("No token received from server");
		}

		// Validate token before storing
		if (isTokenExpired(jwtToken)) {
			logger.logAuth("Signup failed: received expired token", { username, memberEmail });
			throw new Error("Received expired token from server");
		}

		updateStorage({ jwtToken });
		updateUserInfo(jwtToken);
		
		const duration = Date.now() - startTime;
		logger.logAuth("Signup successful", { username, memberEmail, duration: `${duration}ms` });
		logger.logGraphQLSuccess("mutation", "SIGN_UP", duration);
	} catch (err: unknown) {
		const duration = Date.now() - startTime;
		logger.logAuth("Signup failed", { username, memberEmail, duration: `${duration}ms` });
		logger.logGraphQLError("mutation", "SIGN_UP", err, { username, memberEmail });
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
	const startTime = Date.now();

	try {
		logger.debug("Requesting signup JWT token via GraphQL", { username, memberEmail });
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: { username, memberPassword, memberEmail, memberFullName, memberType },
			},
			fetchPolicy: "network-only",
		});

		const accessToken = (result?.data as { signup?: { accessToken?: string } })?.signup?.accessToken;

		if (!accessToken) {
			logger.error("No access token in signup response", undefined, { username, memberEmail });
			throw new Error("No access token in response");
		}

		const duration = Date.now() - startTime;
		logger.debug("Signup JWT token received successfully", { username, memberEmail, duration: `${duration}ms` });
		return { jwtToken: accessToken };
	} catch (err: unknown) {
		const duration = Date.now() - startTime;
		logger.error("Signup token request error", err, { username, memberEmail, duration: `${duration}ms` });
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
	if (typeof window === "undefined") {
		logger.debug("updateStorage called on server side");
		return;
	}

	try {
		setJwtToken(jwtToken);
		window.localStorage.setItem("login", Date.now().toString());
		logger.debug("Storage updated successfully");
	} catch (error) {
		logger.error("Error updating storage", error);
	}
};

/**
 * Decodes JWT token and updates user info in Apollo cache
 * @param jwtToken - JWT token to decode
 * @returns true if successful, false otherwise
 */
export const updateUserInfo = (jwtToken: string): boolean => {
	if (!jwtToken) {
		logger.warn("Cannot update user info: no token provided");
		return false;
	}

	try {
		const claims = jwtDecode<CustomJwtPayload>(jwtToken);

		// Validate essential claims
		if (!claims._id || !claims.username) {
			logger.error("Invalid token: missing essential claims", undefined, {
				hasId: !!claims._id,
				hasUsername: !!claims.username,
			});
			return false;
		}

		userVar({
			_id: claims._id ?? "",
			username: claims.username ?? "",
			memberEmail: claims.memberEmail ?? "",
			memberPhone: claims.memberPhone ?? "",
			memberFullName: claims.memberFullName ?? "",
			memberType: (claims.memberType as MemberType) ?? ("" as MemberType | string),
			emailVerified: claims.emailVerified ?? false,
			memberDesc: claims.memberDesc ?? "",
			memberImage: claims.memberImage ?? "",
			memberPoints: claims.memberPoints ?? 0,
			memberLikes: claims.memberLikes ?? 0,
			memberFollowings: claims.memberFollowings ?? 0,
			memberFollowers: claims.memberFollowers ?? 0,
			memberViews: claims.memberViews ?? 0,
			eventOrganizedCount: claims.eventOrganizedCount ?? 0,
			eventsOrganizedCount: claims.eventsOrganizedCount ?? 0,
			memberStatus: (claims.memberStatus as any) ?? ("" as any),
			memberGroups: claims.memberGroups ?? 0,
			memberEvents: claims.memberEvents ?? 0,
			memberRank: claims.memberRank ?? 0,
			createdAt: claims.createdAt ?? new Date(),
			updatedAt: claims.updatedAt ?? new Date(),
		});

		logger.logAuth("User info updated", {
			userId: claims._id,
			username: claims.username,
			memberType: claims.memberType,
		});
		return true;
	} catch (error) {
		logger.error("Error decoding JWT token", error);
		return false;
	}
};

/**
 * Logs out user by clearing storage and user info
 * @param redirect - Whether to reload the page after logout (default: true)
 */
export const logOut = (redirect: boolean = true) => {
	logger.logAuth("Logout initiated", { redirect });
	try {
		deleteStorage();
		deleteUserInfo();

		if (redirect && typeof window !== "undefined") {
			logger.logAuth("Redirecting to login page");
			// Use router if available, otherwise reload
			window.location.href = "/auth/login";
		}
		logger.logAuth("Logout completed successfully");
	} catch (error) {
		logger.error("Error during logout", error);
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
	if (typeof window === "undefined") {
		logger.debug("deleteStorage called on server side");
		return;
	}

	try {
		localStorage.removeItem("accessToken");
		window.localStorage.setItem("logout", Date.now().toString());
		logger.debug("Storage deleted successfully");
	} catch (error) {
		logger.error("Error deleting storage", error);
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
			memberType: "" as MemberType | string,
			memberStatus: "" as any,
			emailVerified: false,
			memberDesc: "",
			memberImage: "",
			memberPoints: 0,
			memberLikes: 0,
			memberFollowings: 0,
			memberFollowers: 0,
			memberViews: 0,
			eventOrganizedCount: 0,
			eventsOrganizedCount: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			memberGroups: 0,
			memberEvents: 0,
			memberRank: 0,
		});
		logger.debug("User info deleted successfully");
	} catch (error) {
		logger.error("Error deleting user info", error);
	}
};
