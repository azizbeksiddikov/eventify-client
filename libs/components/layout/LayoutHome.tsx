import React from 'react';
import Footer from './Footer';
import Header from './Header';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { NextPage } from 'next';

const withHomeLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') return null;

		return (
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1 mb-8">
					<Page {...props} />
				</main>
				<Footer />
			</div>
		);
	};

	WrappedComponent.displayName = `withHomeLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withHomeLayout;
