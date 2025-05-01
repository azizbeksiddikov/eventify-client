import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { X } from 'lucide-react';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { GroupCategory } from '@/libs/enums/group.enum';

interface CategoriesSidebarProps {
	groupSearch: GroupsInquiry;
	updateURL: (search: GroupsInquiry) => void;
	initialSearch: GroupsInquiry;
}

const CategoriesSidebarGroup = ({ groupSearch, updateURL, initialSearch }: CategoriesSidebarProps) => {
	const handleClearAll = () => {
		updateURL(initialSearch);
	};

	const handleCategoryChange = (category: GroupCategory) => {
		const currentCategories = groupSearch.search?.groupCategories || [];
		const newCategories = currentCategories.includes(category)
			? currentCategories.filter((cat) => cat !== category)
			: [...currentCategories, category];

		updateURL({
			...groupSearch,
			search: { ...groupSearch.search, groupCategories: newCategories },
		});
	};

	return (
		<div className="w-full md:w-72 shrink-0">
			<div className="bg-primary/5 backdrop-blur-sm rounded-2xl shadow-sm border border-primary/20 p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold text-primary">Categories</h3>
					<Button type="submit" onClick={handleClearAll} className="h-10 px-6 bg-secondary/50 text-card-foreground">
						<div className="flex items-center gap-1">
							<X className="w-4 h-4" />
							Clear All
						</div>
					</Button>
				</div>
				<div className="space-y-2">
					{Object.values(GroupCategory).map((category) => (
						<div
							key={category}
							onClick={() => handleCategoryChange(category)}
							className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-left cursor-pointer"
						>
							<Checkbox
								id={`sidebar-${category}`}
								checked={groupSearch.search?.groupCategories?.includes(category)}
								className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none"
							/>
							<Label
								htmlFor={`sidebar-${category}`}
								className="text-sm cursor-pointer text-foreground/90 hover:text-primary transition-colors duration-200 pointer-events-none"
							>
								{category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
							</Label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoriesSidebarGroup;
