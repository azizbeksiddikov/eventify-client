import { useMemo } from "react";
import { ApolloClient, ApolloLink, InMemoryCache, from, NormalizedCacheObject } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { getJwtToken } from "@/libs/auth";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { smallError } from "@/libs/alert";
let apolloClient: ApolloClient<NormalizedCacheObject>;

function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-expect-error
	if (token) headers["Authorization"] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: "accessToken",
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-expect-error
	fetchAccessToken: () => {
		return null;
	},
});

// auth, add jwt from local storage to headers
// add real link to the api
// errors management

function createIsomorphicLink() {
	if (typeof window !== "undefined") {
		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(),
				},
			}));
			console.warn("requesting.. ", operation);
			return forward(operation);
		});

		// @ts-ignore
		const uploadLink = new createUploadLink({
			uri: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
		});

		const errorLink = onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors) {
				graphQLErrors.forEach(({ message, locations, path }) => {
					console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
					if (!message.includes("input")) smallError(message);
				});
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
			// @ts-ignore
			if (networkError?.statusCode === 401) {
			}
		});

		return from([errorLink, tokenRefreshLink, authLink.concat(uploadLink)]);
	}
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === "undefined",
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === "undefined") return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
