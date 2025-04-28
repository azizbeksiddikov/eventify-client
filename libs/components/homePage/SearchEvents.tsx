import { useState } from 'react';
import { useRouter } from 'next/router';

interface SearchFilters {
	location: string;
	eventType: string;
	fromDate: string;
	toDate: string;
}

const SearchEvents = () => {
	const router = useRouter();
	const [filters, setFilters] = useState<SearchFilters>({
		location: '',
		eventType: '',
		fromDate: '',
		toDate: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Navigate to events page with search parameters
		router.push({
			pathname: '/events',
			query: filters,
		});
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-lg">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Find Events</h2>
			<form onSubmit={handleSearch} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label htmlFor="location" className="block text-sm font-medium text-gray-700">
							Location
						</label>
						<input
							type="text"
							id="location"
							name="location"
							value={filters.location}
							onChange={handleChange}
							placeholder="Enter city or venue"
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
							Event Type
						</label>
						<select
							id="eventType"
							name="eventType"
							value={filters.eventType}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						>
							<option value="">All Types</option>
							<option value="concert">Concert</option>
							<option value="conference">Conference</option>
							<option value="exhibition">Exhibition</option>
							<option value="festival">Festival</option>
							<option value="sports">Sports</option>
							<option value="workshop">Workshop</option>
						</select>
					</div>

					<div>
						<label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
							From Date
						</label>
						<input
							type="date"
							id="fromDate"
							name="fromDate"
							value={filters.fromDate}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>

					<div>
						<label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
							To Date
						</label>
						<input
							type="date"
							id="toDate"
							name="toDate"
							value={filters.toDate}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
					</div>
				</div>

				<div className="flex justify-end">
					<button
						type="submit"
						className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Search Events
					</button>
				</div>
			</form>
		</div>
	);
};

export default SearchEvents;
