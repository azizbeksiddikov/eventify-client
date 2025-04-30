import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from 'next-themes';

import { JetBrains_Mono as FontMono, Inter as FontSans } from 'next/font/google';
import type { AppProps } from 'next/app';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

const fontMono = FontMono({
	subsets: ['latin'],
	variable: '--font-mono',
});

const App = ({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<main className={`${fontSans.variable} ${fontMono.variable}`} suppressHydrationWarning>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Component {...pageProps} />
				</ThemeProvider>
			</main>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
