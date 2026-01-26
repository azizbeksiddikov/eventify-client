"use client";

import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";
// import { RetryLink } from "@apollo/client/link/retry";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { getJwtToken, logOut } from "@/libs/auth";
import { smallError } from "@/libs/alert";
import { I18nProvider } from "@/libs/i18n/provider";
import { NEXT_PUBLIC_API_GRAPHQL_URL } from "@/libs/config";
import { logger } from "@/libs/logger";

// Auth link: Only add Authorization header when token exists
const authLink = new ApolloLink((operation, forward) => {
	const token = getJwtToken();
	const operationName = operation.operationName || "Unknown";
	const operationType =
		operation.query.definitions[0]?.kind === "OperationDefinition"
			? operation.query.definitions[0].operation
			: "unknown";

	logger.debug("Apollo Auth Link", {
		operationName,
		operationType,
		hasToken: !!token,
	});

	operation.setContext(({ headers }: { headers: HeadersInit }) => {
		// Only add Authorization header if token exists
		if (token) {
			logger.debug("Adding Authorization header to request", {
				operationName,
				operationType,
			});
			return {
				headers: {
					Authorization: `Bearer ${token}`,
					...headers,
				},
			};
		}
		// No token - return headers as-is (for public queries)
		logger.debug("No token found, making public request", {
			operationName,
			operationType,
		});
		return { headers };
	});

	return forward(operation);
});

// Error link: Handle authentication errors globally
const errorLink = new ErrorLink(({ error, operation }) => {
	const operationName = operation?.operationName || "Unknown";
	const operationType =
		operation?.query.definitions[0]?.kind === "OperationDefinition"
			? operation.query.definitions[0].operation
			: "unknown";

	// Handle GraphQL errors
	if (CombinedGraphQLErrors.is(error)) {
		error.errors.forEach((graphQLError) => {
			const { message, extensions } = graphQLError;
			const errorCode = extensions?.code as string | undefined;

			logger.logGraphQLError(operationType as "query" | "mutation" | "subscription", operationName, graphQLError, {
				errorCode,
				extensions: extensions ? JSON.stringify(extensions) : undefined,
			});

			// Handle authentication/authorization errors
			if (
				errorCode === "UNAUTHENTICATED" ||
				message.includes("Unauthorized") ||
				message.includes("Invalid token") ||
				message.includes("Token expired")
			) {
				logger.logAuth("Authentication error detected", {
					operationName,
					operationType,
					errorCode,
					message,
				});
				smallError(message);

				// Clear invalid token and redirect to login
				if (typeof window !== "undefined") logOut();
			}
		});
	} else {
		// Handle network errors
		logger.error("GraphQL Network Error", error, {
			operationName,
			operationType,
		});

		// Check for 401/403 status codes in network errors
		if (error && typeof error === "object" && "statusCode" in error) {
			const statusCode = (error as { statusCode: number }).statusCode;
			if (statusCode === 401 || statusCode === 403) {
				logger.logAuth("Authentication failed (401/403)", {
					operationName,
					operationType,
					statusCode,
				});
				smallError("Your session has expired. Please login again.");
				if (typeof window !== "undefined") logOut();
				return;
			}
		}
		smallError("Network connection error. Please try again.");
	}
});

// Combine all links in correct order
const link = ApolloLink.from([
	errorLink, // Handle errors first
	// retryLink, // Then retry logic (commented off)
	authLink, // Then add auth headers
	new HttpLink({ uri: NEXT_PUBLIC_API_GRAPHQL_URL }), // Finally make the request
]);

export function Providers({ children }: { children: ReactNode }) {
	logger.info("Initializing Apollo Client", {
		graphqlUrl: NEXT_PUBLIC_API_GRAPHQL_URL,
	});

	const client = new ApolloClient({
		link: link,
		cache: new InMemoryCache(),
	});

	logger.info("Apollo Client initialized successfully");

	return (
		<ApolloProvider client={client}>
			<I18nProvider>{children}</I18nProvider>
		</ApolloProvider>
	);
}
