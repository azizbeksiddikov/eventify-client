import { useTranslation } from 'react-i18next';

import { EventCategory } from '@/libs/enums/event.enum';
import { Button } from '@/libs/components/ui/button';
import { Checkbox } from '@/libs/components/ui/checkbox';
import { Label } from '@/libs/components/ui/label';
import { EventsInquiry } from '@/libs/types/event/event.input';
import { X } from 'lucide-react';

interface CategoriesSidebarProps {
	eventsSearchFilters: EventsInquiry;
	updateURL: (search: EventsInquiry) => void;
	initialSearch: EventsInquiry;
}

const CategoriesSidebar = ({ eventsSearchFilters, updateURL, initialSearch }: CategoriesSidebarProps) => {
	const { t } = useTranslation('common');
	const handleClearAll = () => {
		updateURL(initialSearch);
	};

	const handleCategoryChange = (category: EventCategory) => {
		const currentCategories = eventsSearchFilters.search.eventCategories || [];
		const newCategories = currentCategories.includes(category)
			? currentCategories.filter((cat) => cat !== category)
			: [...currentCategories, category];

		updateURL({
			...eventsSearchFilters,
			search: { ...eventsSearchFilters.search, eventCategories: newCategories },
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
					{Object.values(EventCategory).map((category) => (
						<div
							key={category}
							onClick={() => handleCategoryChange(category)}
							className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors duration-200 text-left cursor-pointer"
						>
							<Checkbox
								id={`sidebar-${category}`}
								checked={eventsSearchFilters.search?.eventCategories?.includes(category)}
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

export default CategoriesSidebar;
