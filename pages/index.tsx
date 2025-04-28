import { NextPage } from 'next';

import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import AutoScrollEvents from '../libs/components/homePage/AutoScrollEvents';
import withBasicLayout from '../libs/components/layout/LayoutBasic';
import EventsByCategory from '../libs/components/homePage/EventsByCategory';
import TopOrganizers from '@/libs/components/homePage/TopOrganizers';
import UpcomingEvents from '@/libs/components/homePage/UpcomingEvents';
import TopGroups from '@/libs/components/homePage/TopGroups';
import SearchEvents from '@/libs/components/homePage/SearchEvents';
import Acknowledgements from '@/libs/components/homePage/Acknowledgements';

const Home: NextPage = () => {
	const device = useDeviceDetect();
	if (device === 'mobile') return null;

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<div className="relative">
				<AutoScrollEvents />
				<SearchEvents />
			</div>

			{/* Main Content */}
			<main className="w-[90%] mx-auto px-8 sm:px-12 lg:px-16 py-12 space-y-16">
				<UpcomingEvents />
				<EventsByCategory />
				<TopGroups />
				<TopOrganizers />
				<Acknowledgements />
			</main>
		</div>
	);
};

export default withBasicLayout(Home);
