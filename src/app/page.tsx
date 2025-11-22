"use client";

import AutoScrollEvents from "@/libs/components/homepage/AutoScrollEvents";
import Acknowledgements from "@/libs/components/homepage/Acknowledgements";

function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<AutoScrollEvents />
			{/* <SearchEvents />
			<UpcomingEvents />
			<EventsByCategory />
			<PopularGroups />
			<TopOrganizers /> */}
			<Acknowledgements />
		</div>
	);
}

export default Home;
