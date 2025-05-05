import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { GroupCategory } from '@/libs/enums/group.enum';
import { GroupsInquiry } from '@/libs/types/group/group.input';

interface GroupSearchProps {
	groupsInquiry: GroupsInquiry;
	setGroupsInquiry: (inquiry: GroupsInquiry) => void;
}

export function GroupSearch({ groupsInquiry, setGroupsInquiry }: GroupSearchProps) {
	const searchTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGroupsInquiry({
			...groupsInquiry,
			search: {
				...groupsInquiry.search,
				text: e.target.value,
			},
		});
	};

	const clearSearchHandler = () => {
		setGroupsInquiry({
			...groupsInquiry,
			search: {
				text: '',
				groupCategories: undefined,
			},
		});
	};

	const changeCategoryHandler = (value: string) => {
		setGroupsInquiry({
			...groupsInquiry,
			search: {
				...groupsInquiry.search,
				groupCategories: value === 'all' ? undefined : (value as GroupCategory),
			},
		});
	};

	const changeSortHandler = (value: string) => {
		setGroupsInquiry({
			...groupsInquiry,
			sort: value,
		});
	};

	return (
		<div className="flex items-center gap-6 p-6 rounded-t-lg bg-card border border-border">
			<Input
				placeholder="Search groups..."
				value={groupsInquiry?.search?.text ?? ''}
				onChange={searchTextHandler}
				className="w-full bg-background text-foreground border-input focus:ring-primary"
			/>
			<Select value={groupsInquiry?.sort} onValueChange={changeSortHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="createdAt">Created At</SelectItem>
					<SelectItem value="memberCount">Members</SelectItem>
					<SelectItem value="eventsCount">Events</SelectItem>
					<SelectItem value="groupViews">Views</SelectItem>
				</SelectContent>
			</Select>
			<Select value={groupsInquiry?.search?.groupCategories ?? 'all'} onValueChange={changeCategoryHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Filter by category" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="all">All Categories</SelectItem>
					<SelectItem value={GroupCategory.SPORTS}>Sports</SelectItem>
					<SelectItem value={GroupCategory.ART}>Art</SelectItem>
					<SelectItem value={GroupCategory.TECHNOLOGY}>Technology</SelectItem>
					<SelectItem value={GroupCategory.FOOD}>Food</SelectItem>
					<SelectItem value={GroupCategory.TRAVEL}>Travel</SelectItem>
					<SelectItem value={GroupCategory.EDUCATION}>Education</SelectItem>
					<SelectItem value={GroupCategory.HEALTH}>Health</SelectItem>
					<SelectItem value={GroupCategory.ENTERTAINMENT}>Entertainment</SelectItem>
					<SelectItem value={GroupCategory.BUSINESS}>Business</SelectItem>
					<SelectItem value={GroupCategory.POLITICS}>Politics</SelectItem>
					<SelectItem value={GroupCategory.RELIGION}>Religion</SelectItem>
					<SelectItem value={GroupCategory.OTHER}>Other</SelectItem>
				</SelectContent>
			</Select>
			<Button
				variant="outline"
				onClick={clearSearchHandler}
				className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
			>
				Clear
			</Button>
		</div>
	);
}
