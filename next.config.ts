/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
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
