import { NextPage } from 'next';
import React from 'react';

import Header from '@/libs/components/layout/Header';
import AuthFooter from '@/libs/components/layout/AuthFooter';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';

const withAuthLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') return null;

		return (
			<div className="min-h-screen flex flex-col">
				<Header />
				<Page {...props} />
				<AuthFooter />
			</div>
		);
	};

	WrappedComponent.displayName = `withAuthLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withAuthLayout;
