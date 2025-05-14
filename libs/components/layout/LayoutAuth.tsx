import { NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import Header from '@/libs/components/layout/Header';
import AuthFooter from '@/libs/components/layout/AuthFooter';
import MobileHeader from '@/libs/components/layout/MobileHeader';

const withAuthLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();
		const { t } = useTranslation();

		if (device === 'mobile')
			return (
				<div className="min-h-screen flex flex-col">
					<MobileHeader />
					<Page {...props} />
					<footer className="w-full bg-foreground/95 backdrop-blur-sm mt-10 px-4 py-3 h-20 flex flex-col justify-center gap-4">
						<p className="text-xs sm:text-sm text-background text-center">
							© {t('2025 Eventify. All rights reserved')}.
						</p>
					</footer>
				</div>
			);

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
