import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Button, buttonVariants } from '../ui/button';
import { Input } from '../ui/input';
import { Direction } from '@/libs/enums/common.enum';
import { ArrowUpDown, X } from 'lucide-react';
import { cn } from '@/libs/utils';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { Group } from '@/libs/types/group/group';

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
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="w-40 justify-start text-left font-normal bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
							>
								<ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
								{sortOptions.find((option) => option.value === groupSearch.sort)?.label}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-48 z-[1000] bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border/50">
							<div className="space-y-2 p-2">
								{sortOptions.map((option) => (
									<Button
										key={option.value}
										variant="ghost"
										className="w-full justify-start hover:bg-accent/50 transition-colors"
										onClick={() => handleSortChange(option.value)}
									>
										{option.label}
									</Button>
								))}
							</div>
						</PopoverContent>
					</Popover>

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
						size="icon"
						onClick={clearAllFilters}
						className="w-9 h-9 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/50 transition-colors"
					>
						<X className="h-4 w-4 text-muted-foreground" />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SortAndFilterGroups;
