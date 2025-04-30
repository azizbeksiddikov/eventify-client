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
		<div className="min-h-screen  flex flex-col">
			{/* Hero Section */}
			<AutoScrollEvents />

			<SearchEvents />
			<UpcomingEvents />
			<EventsByCategory />
			<TopGroups />
			<TopOrganizers />
			<Acknowledgements />
		</div>
	);
};

export default withHomeLayout(Home);
