import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/libs/components/ui/button';
import { Checkbox } from '@/libs/components/ui/checkbox';
import { Label } from '@/libs/components/ui/label';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { GroupCategory } from '@/libs/enums/group.enum';

interface CategoriesSidebarProps {
	groupsSearchFilters: GroupsInquiry;
	updateURL: (search: GroupsInquiry) => void;
	initialSearch: GroupsInquiry;
}

const CategoriesSidebarGroup = ({ groupsSearchFilters, updateURL, initialSearch }: CategoriesSidebarProps) => {
	const { t } = useTranslation('common');
	const handleClearAll = () => {
		updateURL(initialSearch);
	};

	const handleCategoryChange = (category: GroupCategory) => {
		const currentCategories = groupsSearchFilters.search?.groupCategories || [];
		const newCategories = currentCategories.includes(category)
			? currentCategories.filter((cat) => cat !== category)
			: [...currentCategories, category];

		updateURL({
			...groupsSearchFilters,
			search: { ...groupsSearchFilters.search, groupCategories: newCategories },
		});
	};
	return (
		<div className="w-full md:w-72 shrink-0">
			<div className="bg-primary/5 backdrop-blur-sm rounded-2xl shadow-sm border border-primary/20 p-6">
				<h3 className=" text-lg font-semibold text-primary">{t('Categories')}</h3>
				<div className="space-y-2">
					<Button
						type="submit"
						onClick={handleClearAll}
						className="h-10 px-6 bg-secondary/50 text-card-foreground my-4"
					>
						<div className="flex items-center gap-1">
							<X className="w-4 h-4" />
							{t('Clear All')}
						</div>
					</Button>
					{Object.values(GroupCategory).map((category) => (
						<div
							key={category}
							onClick={() => handleCategoryChange(category)}
							className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-left cursor-pointer"
						>
							<Checkbox
								id={`sidebar-${category}`}
								checked={groupsSearchFilters.search?.groupCategories?.includes(category)}
								className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none"
							/>
							<Label
								htmlFor={`sidebar-${category}`}
								className="text-sm cursor-pointer text-foreground/90 hover:text-primary transition-colors duration-200 pointer-events-none"
							>
								{t(category).charAt(0).toUpperCase() + t(category).slice(1).toLowerCase().replace('_', ' ')}
							</Label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoriesSidebarGroup;
