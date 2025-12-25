"use client";

import { useTranslation } from "next-i18next";
import { Textarea } from "@/libs/components/ui/textarea";

interface EventDescriptionFieldProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	className?: string;
}

export const EventDescriptionField = ({ value, onChange, className }: EventDescriptionFieldProps) => {
	const { t } = useTranslation("events");

	return (
		<div className="space-y-2">
			<label htmlFor="eventDesc" className="text-sm font-medium text-foreground">
				{t("events:description")} *
			</label>
			<Textarea
				id="eventDesc"
				name="eventDesc"
				value={value}
				onChange={onChange}
				placeholder={t("describe_your_event")}
				className={`min-h-[120px] ${className || ""}`}
			/>
		</div>
	);
};
