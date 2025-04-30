import { NextPage } from 'next';
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const withHomeLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') return null;

		return (
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1">
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
