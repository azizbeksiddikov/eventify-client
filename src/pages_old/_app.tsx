import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/apollo/client";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "next-themes";

import type { AppProps } from "next/app";
import { Toaster } from "sonner";

const App = ({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<main suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Toaster position="top-right" richColors />
					<Component {...pageProps} />
				</ThemeProvider>
			</main>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
