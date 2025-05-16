import { useTranslation } from 'next-i18next';
import { ArrowUpDown, Search, X } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';

import { organizersSortOptions } from '@/libs/config';
import { OrganizersInquiry } from '@/libs/types/member/member.input';
import { Direction } from '@/libs/enums/common.enum';
import { cn } from '@/libs/utils';

interface SortAndFilterOrganizersProps {
	updateURL: (newSearch: OrganizersInquiry) => void;
	organizerSearch: OrganizersInquiry;
	initialSearch: OrganizersInquiry;
}

const SortAndFilterOrganizers = ({ updateURL, organizerSearch, initialSearch }: SortAndFilterOrganizersProps) => {
	const { t } = useTranslation('common');

	const searchHandler = (text: string) => {
		updateURL({
			...organizerSearch,
			page: 1,
			search: {
				text,
			},
		});
	};

	const sortHandler = (value: string) => {
		updateURL({
			...organizerSearch,
			sort: value,
		});
	};

	const toggleDirection = () => {
		updateURL({
			...organizerSearch,
			direction: organizerSearch.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		});
	};

	const clearAllHandler = () => {
		updateURL(initialSearch);
	};

	return (
		<div className="border rounded-2xl shadow-lg p-4 md:p-6 relative border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-stretch sm:items-center">
					{/* Search Input */}
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={t('Search by name, description...')}
							value={organizerSearch.search.text}
							onChange={(e) => searchHandler(e.target.value)}
							className="pl-9 pr-4  text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 md:h-11"
						/>
					</div>
					{/* 🔽 Sort + Direction + Clear */}
					<div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
						<Select value={organizerSearch.sort} onValueChange={sortHandler}>
							<SelectTrigger className="h-11 min-w-[120px]">
								<ArrowUpDown className="text-muted-foreground mr-2" />
								<SelectValue placeholder={t('Sort by')} />
							</SelectTrigger>
							<SelectContent>
								{organizersSortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{t(option.label)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							size="icon"
							onClick={toggleDirection}
							className="w-14 h-11 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
						>
							<span
								className={cn(
									organizerSearch.direction === Direction.ASC
										? 'text-lg font-bold text-primary'
										: 'text-muted-foreground',
								)}
							>
								↑
							</span>
							<span
								className={cn(
									organizerSearch.direction === Direction.DESC
										? 'text-lg font-bold text-primary'
										: 'text-muted-foreground',
								)}
							>
								↓
							</span>
						</Button>

						<Button
							variant="outline"
							onClick={clearAllHandler}
							className="h-11 hover:bg-accent hover:text-accent-foreground"
						>
							<X className="h-4 w-4 mr-2" />
							{t('Clear')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SortAndFilterOrganizers;
