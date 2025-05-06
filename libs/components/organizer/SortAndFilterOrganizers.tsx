import { useTranslation } from 'react-i18next';
import { ArrowUpDown, Search, X } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';

import { organizersSortOptions } from '@/libs/config';
import { OrganizersInquiry } from '@/libs/types/member/member.input';
import { Direction } from '@/libs/enums/common.enum';

interface SortAndFilterOrganizersProps {
	updateURL: (newSearch: OrganizersInquiry) => void;
	organizerSearch: OrganizersInquiry;
	initialSearch: OrganizersInquiry;
}

const SortAndFilterOrganizers = ({ updateURL, organizerSearch, initialSearch }: SortAndFilterOrganizersProps) => {
	const { t } = useTranslation('common');

	const handleSearch = (text: string) => {
		updateURL({
			...organizerSearch,
			page: 1,
			search: {
				text,
			},
		});
	};

	const handleSortChange = (value: string) => {
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

	const handleClearFilters = () => {
		updateURL(initialSearch);
	};

	return (
		<div className="bg-background border-brounded-2xl shadow-lg p-6 relative  border-border ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
					<div className="relative w-full">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by name, description..."
							value={organizerSearch.search.text}
							onChange={(e) => handleSearch(e.target.value)}
							className="pl-9 pr-4 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11"
						/>
					</div>

					<div className="flex items-center gap-4">
						<Select value={organizerSearch.sort} onValueChange={handleSortChange}>
							<SelectTrigger className="w-[180px] h-11">
								<ArrowUpDown className="text-muted-foreground" />
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								{organizersSortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							size="icon"
							onClick={toggleDirection}
							className="w-16 h-9 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors flex items-center justify-center gap-1"
						>
							<span
								className={`${organizerSearch.direction === Direction.ASC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
							>
								↑
							</span>
							<span
								className={`${organizerSearch.direction === Direction.DESC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
							>
								↓
							</span>
						</Button>

						<Button
							variant="outline"
							onClick={handleClearFilters}
							className="h-11 hover:bg-accent hover:text-accent-foreground"
						>
							<X className="h-4 w-4 " />
							{t('Clear')}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SortAndFilterOrganizers;
