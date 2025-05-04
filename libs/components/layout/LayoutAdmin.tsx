import { NextPage } from 'next';
import React from 'react';
import { Toaster } from 'sonner';

import AdminHeader from '@/libs/components/layout/AdminHeader';
import Footer from '@/libs/components/layout/Footer';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import AdminMenuList from '@/libs/components/admin/AdminMenuList';

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
				<Toaster position="top-right" richColors />
			</div>
		);
	};

	WrappedComponent.displayName = `withAdminLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withAdminLayout;
