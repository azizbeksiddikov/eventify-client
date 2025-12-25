"use client";

import { useTranslation } from "next-i18next";
import { Checkbox } from "@/libs/components/ui/checkbox";

interface IsRealEventCheckboxProps {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}

export const IsRealEventCheckbox = ({ checked, onCheckedChange }: IsRealEventCheckboxProps) => {
	const { t } = useTranslation("events");

	return (
		<div className="flex items-center space-x-2">
			<Checkbox id="isRealEvent" checked={checked} onCheckedChange={(checked) => onCheckedChange(checked as boolean)} />
			<label
				htmlFor="isRealEvent"
				className="text-sm font-medium text-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{t("real_event")}
			</label>
		</div>
	);
};
