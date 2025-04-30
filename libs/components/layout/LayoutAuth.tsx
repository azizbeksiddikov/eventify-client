import { NextPage } from 'next';
import React from 'react';
import Header from './Header';
import AuthFooter from './AuthFooter';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const withAuthLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') return null;

		return (
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1 py-10">
					<Page {...props} />
				</main>
				<AuthFooter />
			</div>
		);
	};

	WrappedComponent.displayName = `withAuthLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withAuthLayout;
