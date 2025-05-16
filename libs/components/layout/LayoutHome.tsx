import { NextPage } from 'next';
import React from 'react';

import Header from '@/libs/components/layout/Header';
import MobileHeader from '@/libs/components/layout/MobileHeader';
import Footer from '@/libs/components/layout/Footer';
import MobileFooter from '@/libs/components/layout/MobileFooter';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import Chat from '@/libs/components/Chat';

const withHomeLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile')
			return (
				<div className="min-h-screen flex flex-col">
					<MobileHeader />
					<main className="flex-grow flex items-center justify-center">
						<Page {...props} />
					</main>
					<Chat />
					<MobileFooter />
				</div>
			);

		return (
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1">
					<Page {...props} />
				</main>
				<Chat />
				<Footer />
			</div>
		);
	};

	WrappedComponent.displayName = `withHomeLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withHomeLayout;
