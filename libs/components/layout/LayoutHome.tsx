import { NextPage } from 'next';
import React from 'react';

import Header from '@/libs/components/layout/Header';
import MobileHeader from '@/libs/components/layout/MobileHeader';
import Footer from '@/libs/components/layout/Footer';
import MobileFooter from '@/libs/components/layout/MobileFooter';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';

const withHomeLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile')
			return (
				<>
					<MobileHeader />
					<Page {...props} />
					<MobileFooter />
				</>
			);

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
