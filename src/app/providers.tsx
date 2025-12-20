"use client";

import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";
// import { RetryLink } from "@apollo/client/link/retry";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { getJwtToken, logOut } from "@/libs/auth";
import { smallError } from "@/libs/alert";

// Auth link: Only add Authorization header when token exists
const authLink = new ApolloLink((operation, forward) => {
	const token = getJwtToken();

	operation.setContext(({ headers }: { headers: HeadersInit }) => {
		// Only add Authorization header if token exists
		if (token) {
			return {
				headers: {
					Authorization: `Bearer ${token}`,
					...headers,
				},
			};
		}
		// No token - return headers as-is (for public queries)
		return { headers };
	});

	return forward(operation);
});

// Error link: Handle authentication errors globally
const errorLink = new ErrorLink(({ error }) => {
	// Handle GraphQL errors
	if (CombinedGraphQLErrors.is(error)) {
		error.errors.forEach((graphQLError) => {
			const { message, extensions } = graphQLError;
			const errorCode = extensions?.code as string | undefined;

			// Handle authentication/authorization errors
			if (
				errorCode === "UNAUTHENTICATED" ||
				message.includes("Unauthorized") ||
				message.includes("Invalid token") ||
				message.includes("Token expired")
			) {
				console.warn("Authentication error detected:", message);
				smallError(message);

				// Clear invalid token and redirect to login
				if (typeof window !== "undefined") logOut();
			}
		});
	} else {
		// Handle network errors
		console.error(`[Network error]: ${error}`);

		// Check for 401/403 status codes in network errors
		if (error && typeof error === "object" && "statusCode" in error) {
			const statusCode = (error as { statusCode: number }).statusCode;
			if (statusCode === 401 || statusCode === 403) {
				console.warn("Authentication failed (401/403)");
				smallError("Your session has expired. Please login again.");
				if (typeof window !== "undefined") logOut();
				return;
			}
		}
		smallError("Network connection error. Please try again.");
	}
});

// Retry link configuration - COMMENTED OFF FOR NOW
// const retryLink = new RetryLink({
// 	delay: {
// 		initial: 300,
// 		max: 3000,
// 		jitter: true,
// 	},
// 	attempts: {
// 		max: 3,
// 		retryIf: (error) => {
// 			// Don't retry authentication errors
// 			if (error?.message?.includes("Unauthorized") || error?.message?.includes("Invalid token")) {
// 				return false;
// 			}
// 			// Retry network errors and server errors (5xx)
// 			return !!error;
// 		},
// 	},
// });

// Combine all links in correct order
const link = ApolloLink.from([
	errorLink, // Handle errors first
	// retryLink, // Then retry logic (commented off)
	authLink, // Then add auth headers
	new HttpLink({ uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL }), // Finally make the request
]);

export function Providers({ children }: { children: ReactNode }) {
	const client = new ApolloClient({
		link: link,
		cache: new InMemoryCache(),
	});

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
