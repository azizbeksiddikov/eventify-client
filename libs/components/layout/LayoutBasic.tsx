import { NextPage } from 'next';
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const withBasicLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') return null;

		return (
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1 py-10">
					<Page {...props} />
				</main>
				<Footer />
			</div>
		);
	};

	WrappedComponent.displayName = `withBasicLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withBasicLayout;
