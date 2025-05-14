import { NextPage } from 'next';
import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import AutoScrollEvents from '@/libs/components/homepage/AutoScrollEvents';
import EventsByCategory from '@/libs/components/homepage/EventsByCategory';
import TopOrganizers from '@/libs/components/homepage/TopOrganizers';
import UpcomingEvents from '@/libs/components/homepage/UpcomingEvents';
import PopularGroups from '@/libs/components/homepage/PopularGroups';
import SearchEvents from '@/libs/components/homepage/SearchEvents';
import Acknowledgements from '@/libs/components/homepage/Acknowledgements';
import withHomeLayout from '@/libs/components/layout/LayoutHome';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale = 'en' }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<div className="flex flex-col">
				<SearchEvents />
				<UpcomingEvents />
				<PopularGroups />
				<Acknowledgements />
			</div>
		);
	} else {
		return (
			<div className="min-h-screen  flex flex-col">
				<AutoScrollEvents />
				<SearchEvents />
				<UpcomingEvents />
				<EventsByCategory />
				<PopularGroups />
				<TopOrganizers />
				<Acknowledgements />
			</div>
		);
	}
};

export default withHomeLayout(Home);
