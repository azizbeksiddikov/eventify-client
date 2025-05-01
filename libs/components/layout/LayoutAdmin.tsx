import { NextPage } from 'next';
import React from 'react';
import AdminHeader from './AdminHeader';
import Footer from './Footer';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import AdminMenuList from '../admin/AdminMenuList';

const withAdminLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') return null;

		return (
			<div className="min-h-screen flex flex-col">
				<AdminHeader />
				<div className="flex-1 flex">
					<aside className="w-64 border-r border-border bg-background p-4">
						<AdminMenuList />
					</aside>
					<main className="flex-1 py-10">
						<Page {...props} />
					</main>
				</div>
				<Footer />
			</div>
		);
	};

	WrappedComponent.displayName = `withAdminLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withAdminLayout;
