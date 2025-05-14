import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { CalendarIcon, SearchIcon } from 'lucide-react';

import { Input } from '@/libs/components/ui/input';
import { Button } from '@/libs/components/ui/button';
import { Card } from '@/libs/components/ui/card';
import { Calendar } from '@/libs/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/components/ui/popover';
import { readDate } from '@/libs/utils';

const SearchEvents = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	const [text, setText] = useState('');
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();

	const searchHandler = (e: React.FormEvent) => {
		e.preventDefault();

		const query: Record<string, string> = {};

		if (text.trim()) query.text = text.trim();
		if (startDate) query.startDate = readDate(startDate);
		if (endDate) query.endDate = readDate(endDate);

		router.push({
			pathname: '/event',
			query,
		});
	};

	console.log('Inside search events');
	return (
		<div className="bg-secondary/70 py-8 sm:py-10 md:py-16 lg:py-20 xl:py-24 shadow-lg">
			<div className="flex-container px-4 sm:px-6 md:px-8 lg:px-10">
				<h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 md:mb-8 text-center">{t('Find Events')}</h2>
				<Card className="p-4 sm:p-5 md:p-6 lg:p-8 w-full max-w-5xl mx-auto border-2 border-primary/20 shadow-md">
					<form
						onSubmit={searchHandler}
						className="flex flex-col sm:flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4"
					>
						<div className="flex-1 relative">
							<Input
								type="text"
								placeholder={t('Search Events')}
								className="w-full h-10 sm:h-12 md:h-14 text-base sm:text-lg pl-10 rounded-md focus:ring-2 focus:ring-primary/50 transition-all"
								value={text}
								onChange={(e) => setText(e.target.value)}
							/>
							<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
						</div>

						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full sm:w-36 md:w-40 h-10 sm:h-12 md:h-14 justify-start text-left font-normal border border-input hover:bg-accent/50 transition-colors text-xs sm:text-sm md:text-base"
									>
										<CalendarIcon className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
										{startDate ? format(startDate, 'PPP') : <span>{t('Start date')}</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
								</PopoverContent>
							</Popover>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className="w-full sm:w-36 md:w-40 h-10 sm:h-12 md:h-14 justify-start text-left font-normal border border-input hover:bg-accent/50 transition-colors text-xs sm:text-sm md:text-base"
									>
										<CalendarIcon className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
										{endDate ? format(endDate, 'PPP') : <span>{t('End date')}</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
								</PopoverContent>
							</Popover>
						</div>
						<Button
							type="submit"
							className="h-10 sm:h-12 md:h-14 px-4 sm:px-6 md:px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base"
						>
							{t('Search')}
						</Button>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default SearchEvents;
