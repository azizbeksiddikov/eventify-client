import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@/libs/components/ui/input';
import { Button } from '@/libs/components/ui/button';
import { Card } from '@/libs/components/ui/card';

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
			pathname: '/events',
			query,
		});
	};

	return (
		<div className="bg-primary/5 py-24">
			<div className="container w-full max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-foreground mb-8 text-center">Find Events</h2>
				<Card className="p-8">
					<form onSubmit={handleSearch} className="flex items-center gap-4">
						<div className="flex-1">
							<Input
								type="text"
								placeholder="Search events..."
								className="w-full h-14 text-lg"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Input
							type="text"
							placeholder="Location"
							className="w-48 h-14"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
						<div className="flex items-center gap-2">
							<Input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-40 h-14"
							/>
							<span className="text-muted-foreground">to</span>
							<Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-40 h-14" />
						</div>
						<Button type="submit" className="h-14 px-8">
							Search
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default SearchEvents;
