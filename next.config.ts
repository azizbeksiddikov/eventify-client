import type { NextConfig } from 'next';
import { i18n } from './next-i18next.config';

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	images: {
		domains: [
			'images.pexels.com',
			's3.us-east-2.amazonaws.com',
			'thumbs.dreamstime.com',
			'images.unsplash.com',
			'hips.hearstapps.com',
			'www.fourseasons.com',
			'www.rrc.ca',
			'blogs.nvidia.com',
			'localhost',
		],
	},
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
};

nextConfig.i18n = i18n;

module.exports = nextConfig;
