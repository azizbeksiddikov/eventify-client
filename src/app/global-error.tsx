"use client";

import "./globals.css";

/**
 * Last resort: replaces the whole page when the root layout itself fails, so it cannot use the
 * providers, translations or components that may have caused the crash. Plain English on purpose.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html lang="en">
			<body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center text-neutral-900">
				<h1 className="mb-3 text-3xl font-bold">Something went wrong</h1>
				<p className="mb-8 max-w-md text-neutral-600">
					We hit an unexpected problem. You can try again, or go back to the home page.
				</p>
				<div className="flex gap-3">
					<button className="h-11 rounded-md bg-neutral-900 px-6 text-white" onClick={reset}>
						Try again
					</button>
					{/* A plain link on purpose: the router may be what crashed. */}
					{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
					<a className="inline-flex h-11 items-center rounded-md border border-neutral-300 px-6" href="/">
						Go to home page
					</a>
				</div>
			</body>
		</html>
	);
}
