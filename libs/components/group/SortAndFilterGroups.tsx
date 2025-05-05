import { useTranslation } from 'react-i18next';
import { ArrowUpDown, X } from 'lucide-react';

import { Button, buttonVariants } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';

import { groupsSortOptions } from '@/libs/config';
import { cn } from '@/libs/utils';
import { smallError } from '@/libs/alert';
import { Direction, Message } from '@/libs/enums/common.enum';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { Group } from '@/libs/types/group/group';

interface SortAndFilterProps {
	updateURL: (search: GroupsInquiry) => void;
	groupsSearchFilters: GroupsInquiry;
	initialSearch: GroupsInquiry;
}

function SortAndFilterGroups({ updateURL, groupsSearchFilters, initialSearch }: SortAndFilterProps) {
	const { t } = useTranslation('common');

	const handleSearch = (text: string) => {
		updateURL({
			...groupsSearchFilters,
			search: {
				...groupsSearchFilters.search,
				text: text,
			},
		});
	};

	const handleSortChange = (value: string) => {
		const sortOption = groupsSortOptions.find((option) => option.value === value);

		if (!sortOption) smallError(t(Message.INVALID_SORT_OPTION));

		updateURL({
			...groupsSearchFilters,
			sort: sortOption?.value as keyof Group,
		});
	};

	const toggleDirection = () => {
		updateURL({
			...groupsSearchFilters,
			direction: groupsSearchFilters.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		});
	};

	const clearAllFilters = () => {
		updateURL(initialSearch);
	};

	return (
		<div className="rounded-2xl shadow-lg p-6 mb-8 relative  border-border/80 border-2 w-[75%] mx-auto">
			<div className="flex flex-row items-center justify-between gap-12">
				<Input
					placeholder={t('Search groups...')}
					value={groupsSearchFilters.search?.text}
					onChange={(e) => handleSearch(e.target.value)}
					className={cn(
						buttonVariants({ variant: 'ghost', size: 'icon' }),
						'w-[400px] bg-background/80  backdrop-blur-sm border-border/50 transition-colors  hover:bg-accent/50    ',
					)}
				/>

				<div className="flex items-center gap-4">
					<Select value={groupsSearchFilters.sort} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[180px] h-11">
							<ArrowUpDown className="text-muted-foreground" />
							<SelectValue placeholder={t('Sort by')} />
						</SelectTrigger>
						<SelectContent>
							{groupsSortOptions.map((option) => (
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
						className="w-16 h-9 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors flex items-center justify-center gap-1"
					>
						<span
							className={`${groupsSearchFilters.direction === Direction.ASC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
						>
							↑
						</span>
						<span
							className={`${groupsSearchFilters.direction === Direction.DESC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
						>
							↓
						</span>
					</Button>

					<Button
						variant="outline"
						onClick={clearAllFilters}
						className="h-11 hover:bg-accent hover:text-accent-foreground"
					>
						<X className="h-4 w-4 " />
						{t('Clear')}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilterGroups;
