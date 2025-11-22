import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en" suppressHydrationWarning>
			<Head>
				{/* Basic SEO */}
				<meta charSet="UTF-8" />
				<meta name="theme-color" content="#ffffff" />
				<meta name="robots" content="index,follow" />
				<meta
					name="description"
					content="Eventify – Effortlessly create, manage, and join exciting events across the globe in English, Korean, Russian, and Uzbek."
				/>
				<meta
					name="keywords"
					content="Eventify, events, event management, create events, join events, community events, ticketing, EN, KO, RU, UZ"
				/>
				<meta name="author" content="Eventify Team" />
				<link rel="icon" type="image/png" href="/images/logo.png" />

				{/* Open Graph */}
				<meta property="og:title" content="Eventify – Discover and Host Events That Matter" />
				<meta
					property="og:description"
					content="Create, manage, and attend events in your language. Eventify supports English, Korean, Russian, and Uzbek."
				/>
				<meta property="og:image" content="/images/logo.png" />
			</Head>

			<body className={` bg-background antialiased`}>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
