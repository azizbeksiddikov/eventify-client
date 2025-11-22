// import { i18n } from './next-i18next.config';

/** @type {import('next').NextConfig} */
import nextI18nextConfig from "./next-i18next.config.js";
import type { Configuration } from "webpack";

const nextConfig = {
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
	},
	eslint: {
		ignoreDuringBuilds: true,
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
	i18n: nextI18nextConfig.i18n,
	webpack: (config: Configuration) => {
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...config.resolve.alias,
			"@": ".",
		};
		return config;
	},
};

export default nextConfig;
