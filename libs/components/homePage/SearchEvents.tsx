import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@/libs/components/ui/input';
import { Button } from '@/libs/components/ui/button';
import { Card } from '@/libs/components/ui/card';
import { Calendar } from '@/libs/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useTranslation } from 'next-i18next';

const SearchEvents = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();
	const [location, setLocation] = useState('');
	const { t } = useTranslation('common');
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
			query.startDate = startDate.toISOString().split('T')[0];
		}
		if (endDate) {
			query.endDate = endDate.toISOString().split('T')[0];
		}

		router.push({
			pathname: '/event',
			query,
		});
	};

	return (
		<div className="bg-secondary/50 py-24">
			<div className="flex-container">
				<h2>{t('Find Events')}</h2>
				<Card className="p-8">
					<form onSubmit={handleSearch} className="flex items-center gap-4">
						<div className="flex-1">
							<Input
								type="text"
								placeholder={t('Search Events')}
								className="w-full h-14 text-lg"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Input
							type="text"
							placeholder={t('Location')}
							className="w-48 h-14"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
						<div className="flex items-center gap-2">
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className="w-40 h-14 justify-start text-left font-normal">
										<CalendarIcon className="mr-2 h-4 w-4" />
										{startDate ? format(startDate, 'PPP') : <span>{t('Start date')}</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className="w-40 h-14 justify-start text-left font-normal">
										<CalendarIcon className="mr-2 h-4 w-4" />
										{endDate ? format(endDate, 'PPP') : <span>{t('End date')}</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
								</PopoverContent>
							</Popover>
						</div>
						<Button type="submit" className="h-14 px-8">
							{t('Search')}
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default SearchEvents;
