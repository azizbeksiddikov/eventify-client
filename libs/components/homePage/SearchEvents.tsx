import { useState } from 'react';
import { useRouter } from 'next/router';

const SearchEvents = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [location, setLocation] = useState('');

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();

		const query: Record<string, string> = {};

		if (searchQuery.trim()) {
			query.q = searchQuery.trim();
		}
		if (location.trim()) {
			query.location = location.trim();
		}
		if (startDate) {
			query.startDate = startDate;
		}
		if (endDate) {
			query.endDate = endDate;
		}

		router.push({
			pathname: '/groups',
			query,
		});
	};

	return (
		<div className="w-full bg-[#E60023]/5 py-12">
			<div className="w-full max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-[#111111] mb-8 text-center">Find Your Next Event</h2>
				<form onSubmit={handleSearch} className="flex items-center gap-4 bg-white p-8 rounded-2xl shadow-lg">
					<div className="flex-1 relative">
						<input
							type="text"
							placeholder="Search events, groups, or organizers..."
							className="w-full px-6 py-5 rounded-full bg-white border border-[#E5E5E5] focus:outline-none focus:border-[#E60023] focus:ring-2 focus:ring-[#FF4D4D] text-[#111111] text-lg transition-all duration-300"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<button
							type="submit"
							className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#E60023] hover:text-[#CC0000] transition-colors duration-300"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</button>
					</div>
					<input
						type="text"
						placeholder="Location"
						className="w-48 px-6 py-5 rounded-full bg-white border border-[#E5E5E5] focus:outline-none focus:border-[#E60023] focus:ring-2 focus:ring-[#FF4D4D] text-[#111111] transition-all duration-300"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
					<div className="flex items-center gap-2">
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="w-40 px-6 py-5 rounded-full bg-white border border-[#E5E5E5] focus:outline-none focus:border-[#E60023] focus:ring-2 focus:ring-[#FF4D4D] text-[#111111] transition-all duration-300"
						/>
						<span className="text-[#6E6E6E]">to</span>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="w-40 px-6 py-5 rounded-full bg-white border border-[#E5E5E5] focus:outline-none focus:border-[#E60023] focus:ring-2 focus:ring-[#FF4D4D] text-[#111111] transition-all duration-300"
						/>
					</div>
					<button
						type="submit"
						className="px-8 py-5 bg-[#E60023] text-white rounded-full font-medium hover:bg-[#CC0000] transition-colors duration-300 whitespace-nowrap shadow-md hover:shadow-lg"
					>
						Search Events
					</button>
				</form>
			</div>
		</div>
	);
};

export default SearchEvents;
