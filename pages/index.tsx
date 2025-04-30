import { NextPage } from 'next';

import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import AutoScrollEvents from '../libs/components/homePage/AutoScrollEvents';
import EventsByCategory from '../libs/components/homePage/EventsByCategory';
import TopOrganizers from '@/libs/components/homePage/TopOrganizers';
import UpcomingEvents from '@/libs/components/homePage/UpcomingEvents';
import TopGroups from '@/libs/components/homePage/TopGroups';
import SearchEvents from '@/libs/components/homePage/SearchEvents';
import Acknowledgements from '@/libs/components/homePage/Acknowledgements';
import withHomeLayout from '@/libs/components/layout/LayoutHome';

const Home: NextPage = () => {
	const device = useDeviceDetect();
	if (device === 'mobile') return null;

	return (
		<div className="min-h-screen ">
			{/* Hero Section */}
			<div className="relative">
				<AutoScrollEvents />
				<SearchEvents />
			</div>

			{/* Main Content */}
			<main className="w-[90%] mx-auto flex flex-col gap-10">
				<UpcomingEvents />
				<EventsByCategory />
				<TopGroups />
				<TopOrganizers />
				<Acknowledgements />
			</main>
		</div>
	);
};

export default withHomeLayout(Home);
