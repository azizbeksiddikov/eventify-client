import type { Metadata, Viewport } from "next";

// Providers
import { Providers } from "./providers";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

import Header from "@/libs/components/layout/Header";
import Footer from "@/libs/components/layout/Footer";
import { getAbsoluteUrl } from "@/libs/config";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
};

export const metadata: Metadata = {
	title: {
		default: "Eventify",
		template: "%s | Eventify",
	},
	description:
		"Discover local events, join groups, and connect with people who share your interests on Eventify. Create specific events or join existing ones nearby.",
	applicationName: "Eventify",
	authors: [{ name: "Azizbek Siddikov" }],
	keywords: ["events", "meetup", "community", "groups", "social", "gathering"],
	creator: "Azizbek Siddikov",
	publisher: "Eventify",
	robots: {
		index: true,
		follow: true,
	},
	icons: {
		icon: "/images/logo.png",
		apple: "/images/logo.png",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: getAbsoluteUrl("/"),
		title: "Eventify",
		description: "Discover local events, join groups, and connect with people who share your interests on Eventify.",
		siteName: "Eventify",
		images: [
			{
				url: getAbsoluteUrl("/images/logo.png"),
				width: 800,
				height: 600,
				alt: "Eventify Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Eventify",
		description: "Discover local events, join groups, and connect with people who share your interests on Eventify.",
		images: [getAbsoluteUrl("/images/logo.png")],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="antialiased w-full">
				<Providers>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<Toaster richColors position="top-right" closeButton />
						<div className="flex flex-col min-h-screen w-full">
							<Header />
							<main className="flex-1 w-full flex flex-col">{children}</main>
							<Footer />
						</div>
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
