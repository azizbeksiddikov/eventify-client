"use client";

import { useTranslation } from "next-i18next";
import { Input } from "@/libs/components/ui/input";

interface EventTagsFieldProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
}

export const EventTagsField = ({ value, onChange, className }: EventTagsFieldProps) => {
	const { t } = useTranslation("events");

	return (
		<div className="space-y-2">
			<label htmlFor="eventTags" className="text-sm font-medium text-foreground">
				{t("tags")} * <span className="text-muted-foreground text-xs">({t("comma-separated")})</span>
			</label>
			<Input
				id="eventTags"
				name="eventTags"
				value={value}
				onChange={onChange}
				placeholder={t("e_g_networking_workshop_conference")}
				className={className}
			/>
		</div>
	);
};
