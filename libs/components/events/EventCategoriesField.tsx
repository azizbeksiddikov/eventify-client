"use client";

import { useTranslation } from "next-i18next";
import { Button } from "@/libs/components/ui/button";
import { EventCategory } from "@/libs/enums/event.enum";

interface EventCategoriesFieldProps {
	selectedCategories: EventCategory[];
	onCategoryToggle: (category: EventCategory) => void;
	className?: string;
}

export const EventCategoriesField = ({
	selectedCategories,
	onCategoryToggle,
	className,
}: EventCategoriesFieldProps) => {
	const { t } = useTranslation("events");

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-foreground">{t("categories_select_up_to_3")} *</label>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
				{Object.values(EventCategory).map((category) => (
					<Button
						key={category}
						type="button"
						variant={selectedCategories.includes(category) ? "default" : "outline"}
						onClick={() => onCategoryToggle(category)}
						disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category)}
						className={`h-10 transition-all duration-200 ${
							selectedCategories.includes(category)
								? "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
								: "bg-transparent text-foreground hover:bg-primary/10 hover:text-primary"
						} disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
					>
						{t(category.toLowerCase())}
					</Button>
				))}
			</div>
		</div>
	);
};
