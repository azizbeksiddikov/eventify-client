"use client";

import { useTranslation } from "next-i18next";
import type { InlineValidation } from "@/libs/hooks/useInlineValidation";
import { Input } from "@/libs/components/ui/input";

interface EventNameFieldProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	validation?: InlineValidation;
}

export const EventNameField = ({ value, onChange, className, validation }: EventNameFieldProps) => {
	const { t } = useTranslation("events");

	return (
		<div className="space-y-2">
			<label htmlFor="eventName" className="text-sm font-medium text-foreground">
				{t("event_name")} *
			</label>
			<Input
				id="eventName"
				{...validation?.errorProps("eventName")}
				name="eventName"
				value={value}
				onChange={onChange}
				placeholder={t("enter_event_name")}
				className={className}
			/>
			{validation?.errorText("eventName")}
		</div>
	);
};
