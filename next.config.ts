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
				port: "3007",
				pathname: "/**",
			},
			// External event sources
			{
				protocol: "https",
				hostname: "*.meetup.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "secure.meetupstatic.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.lu.ma",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.lumacdn.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "*.eventbrite.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "img.evbuc.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**.amazonaws.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "**.cloudfront.net",
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
