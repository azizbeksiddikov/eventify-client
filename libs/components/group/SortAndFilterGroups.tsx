import { Button, buttonVariants } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Direction } from '@/libs/enums/common.enum';
import { ArrowUpDown, X } from 'lucide-react';
import { cn } from '@/libs/utils';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { Group } from '@/libs/types/group/group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';

const sortOptions = [
	{ value: 'createdAt', label: 'Newest' },
	{ value: 'memberCount', label: 'Members' },
	{ value: 'groupViews', label: 'Views' },
	{ value: 'groupLikes', label: 'Likes' },
];

interface SortAndFilterProps {
	updateURL: (search: GroupsInquiry) => void;
	groupSearch: GroupsInquiry;
}

function SortAndFilterGroups({ updateURL, groupSearch }: SortAndFilterProps) {
	const handleSearch = (text: string) => {
		updateURL({
			...groupSearch,
			search: {
				text: text,
			},
		});
	};

	const handleSortChange = (value: string) => {
		updateURL({
			...groupSearch,
			sort: value as keyof Group,
		});
	};

	const toggleDirection = () => {
		updateURL({
			...groupSearch,
			direction: groupSearch.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
		});
	};

	const clearAllFilters = () => {
		updateURL({
			search: {
				text: '',
			},
			sort: 'createdAt',
			direction: Direction.DESC,
			page: 1,
			limit: 10,
		});
	};

	return (
		<div className="rounded-2xl shadow-lg p-6 mb-8 relative  border-border/80 border-2 w-[75%] mx-auto">
			<div className="flex flex-row items-center justify-between gap-12">
				<Input
					placeholder="Search groups..."
					value={groupSearch.search?.text}
					onChange={(e) => handleSearch(e.target.value)}
					className={cn(
						buttonVariants({ variant: 'ghost', size: 'icon' }),
						'w-[400px] bg-background/80  backdrop-blur-sm border-border/50 transition-colors  hover:bg-accent/50    ',
					)}
				/>

				<div className="flex items-center gap-4">
					<Select value={groupSearch.sort} onValueChange={handleSortChange}>
						<SelectTrigger className="w-[180px] h-11">
							<ArrowUpDown className="text-muted-foreground" />
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							{sortOptions.map((option) => (
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
							className={`${groupSearch.direction === Direction.ASC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
						>
							↑
						</span>
						<span
							className={`${groupSearch.direction === Direction.DESC ? 'text-lg font-bold text-primary' : 'text-sm text-muted-foreground'}`}
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
						Clear
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilterGroups;
