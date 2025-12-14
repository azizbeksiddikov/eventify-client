"use client";

import AutoScrollEvents from "@/libs/components/homepage/AutoScrollEvents";
import SearchEvents from "@/libs/components/homepage/SearchEvents";
import Acknowledgements from "@/libs/components/homepage/Acknowledgements";
import UpcomingEvents from "@/libs/components/homepage/UpcomingEvents";
import EventsByCategory from "@/libs/components/homepage/EventsByCategory";
import PopularGroups from "@/libs/components/homepage/PopularGroups";
import TopOrganizers from "@/libs/components/homepage/TopOrganizers";

function Home() {
	return (
		<div className="min-h-screen flex flex-col w-full">
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

export default Home;
