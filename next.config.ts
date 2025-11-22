/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_APP_API_URL: process.env.NEXT_APP_API_URL,
		NEXT_PUBLIC_API_GRAPHQL_URL: process.env.NEXT_PUBLIC_API_GRAPHQL_URL,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "eventify.azbek.me",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "eventify.azbek.me",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "82.29.162.87",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				pathname: "/**",
			},
		],
	},
	trailingSlash: false,
	reactStrictMode: true,
	reactCompiler: true,
	turbopack: {
		resolveAlias: {
			"@": ".",
		},
	},
};

export default nextConfig;
