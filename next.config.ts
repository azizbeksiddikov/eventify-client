// import { i18n } from './next-i18next.config';

/** @type {import('next').NextConfig} */
import nextI18nextConfig from './next-i18next.config.js';

const nextConfig = {
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [{ hostname: 'localhost' }],
	},
	trailingSlash: false,
	reactStrictMode: true,
	i18n: nextI18nextConfig.i18n,
};

export default nextConfig;
