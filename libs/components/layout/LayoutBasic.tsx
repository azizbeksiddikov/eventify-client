import React from 'react';
import Footer from '../Footer';
import Header from './Header';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { NextPage } from 'next';

const withBasicLayout = (Page: NextPage) => {
	const WrappedComponent = (props: Record<string, unknown>) => {
		const device = useDeviceDetect();

		if (device === 'mobile') {
			return (
				<div className="min-h-screen flex flex-col">
					<div className="p-4">Mobile Layout</div>
					<main className="flex-1">
						<Page {...props} />
					</main>
				</div>
			);
		}

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

	WrappedComponent.displayName = `withBasicLayout(${Page.displayName || Page.name || 'Component'})`;
	return WrappedComponent;
};

export default withBasicLayout;
