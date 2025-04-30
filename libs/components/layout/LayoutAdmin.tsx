import { NextPage } from 'next';
import React from 'react';
import AdminHeader from './AdminHeader';
import Footer from './Footer';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const withAdminLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') return null;

		return (
			<div className="min-h-screen flex flex-col">
				<AdminHeader />
				<main className="flex-1 py-10">
					<Page {...props} />
				</main>
				<Footer />
			</div>
		);
	};

	WrappedComponent.displayName = `withAdminLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withAdminLayout;
