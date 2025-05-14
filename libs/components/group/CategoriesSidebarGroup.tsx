import { useTranslation } from 'next-i18next';
import { Filter, X } from 'lucide-react';
import { useMemo } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/libs/components/ui/popover';
import { ScrollArea } from '@/libs/components/ui/scroll-area';
import { Button } from '@/libs/components/ui/button';
import { Checkbox } from '@/libs/components/ui/checkbox';
import { Label } from '@/libs/components/ui/label';

import useDeviceDetect from '@/libs/hooks/useDeviceDetect';
import { GroupsInquiry } from '@/libs/types/group/group.input';
import { GroupCategory } from '@/libs/enums/group.enum';

interface CategoriesSidebarProps {
	groupsSearchFilters: GroupsInquiry;
	updateURL: (search: GroupsInquiry) => void;
	initialSearch: GroupsInquiry;
}

const CategoriesSidebarGroup = ({ groupsSearchFilters, updateURL, initialSearch }: CategoriesSidebarProps) => {
	const { t } = useTranslation('common');
	const device = useDeviceDetect();

	const hasSelectedCategories = useMemo(
		() => groupsSearchFilters?.search?.groupCategories && groupsSearchFilters.search.groupCategories.length > 0,
		[groupsSearchFilters.search?.groupCategories],
	);

	const clearButtonClasses = useMemo(
		() => `${hasSelectedCategories ? 'bg-primary text-primary-foreground' : 'opacity-50 cursor-not-allowed'}`,
		[hasSelectedCategories],
	);

	const clearAllHandler = () => {
		updateURL(initialSearch);
	};

	const changeCategoryHandler = (category: GroupCategory) => {
		const currentCategories = groupsSearchFilters.search?.groupCategories || [];
		const newCategories = currentCategories.includes(category)
			? currentCategories.filter((cat) => cat !== category)
			: [...currentCategories, category];

		updateURL({
			...groupsSearchFilters,
			search: { ...groupsSearchFilters.search, groupCategories: newCategories },
		});
	};

	const formatCategory = (category: string) => {
		return t(category)
			.toLowerCase()
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (char) => char.toUpperCase());
	};

	const renderCategoryItems = () => (
		<div className="space-y-2">
			{Object.values(GroupCategory).map((category) => {
				const checked = groupsSearchFilters.search?.groupCategories?.includes(category);
				return (
					<div
						key={category}
						onClick={() => changeCategoryHandler(category)}
						className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-left cursor-pointer"
					>
						<Checkbox
							id={`sidebar-${category}`}
							checked={checked}
							className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none"
						/>
						<Label
							htmlFor={`sidebar-${category}`}
							className="text-sm cursor-pointer text-foreground/90 hover:text-primary transition-colors duration-200 pointer-events-none"
						>
							{formatCategory(category)}
						</Label>
					</div>
				);
			})}
		</div>
	);

	const renderClearButton = (mobile = false) => (
		<Button
			type="button"
			onClick={clearAllHandler}
			className={`${mobile ? 'h-8 px-3' : 'h-10 px-6'} bg-secondary/50 text-card-foreground ${mobile ? '' : 'my-4'} ${clearButtonClasses}`}
		>
			<div className="flex items-center gap-1">
				<X className="w-4 h-4" />
				{t('Clear All')}
			</div>
		</Button>
	);

	if (device === 'mobile') {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" className="w-full justify-start">
						<Filter className="mr-2 h-4 w-4" />
						{t('Filter Categories')}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[90vw] max-w-sm p-0">
					<ScrollArea className="bg-primary/5 backdrop-blur-sm h-90 rounded-md p-4 border border-primary/20 shadow-sm sm:w-64">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-base font-semibold text-primary">{t('Categories')}</h3>
							{renderClearButton(true)}
						</div>
						{renderCategoryItems()}
					</ScrollArea>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<div className="w-full md:w-72 shrink-0">
			<div className="bg-primary/5 backdrop-blur-sm rounded-2xl shadow-sm border border-primary/20 p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-primary">{t('Categories')}</h3>
					{renderClearButton()}
				</div>
				{renderCategoryItems()}
			</div>
		</div>
	);
};

export default CategoriesSidebarGroup;
