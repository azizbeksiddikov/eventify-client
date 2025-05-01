import type { NextConfig } from 'next';

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
		],
	},
};

export default nextConfig;
