"use client";

import { useTranslation } from "next-i18next";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { EventLocationType } from "@/libs/enums/event.enum";

interface LocationFieldsProps {
	city: string;
	address: string;
	locationType: EventLocationType;
	onCityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	showLocationType?: boolean;
	onLocationTypeChange?: (locationType: EventLocationType) => void;
	className?: string;
}

export const LocationFields = ({
	city,
	address,
	locationType,
	onCityChange,
	onAddressChange,
	showLocationType = false,
	onLocationTypeChange,
	className,
}: LocationFieldsProps) => {
	const { t } = useTranslation("events");

	// For update page, always show location fields
	// For create page, only show when locationType is OFFLINE
	if (!showLocationType && locationType === EventLocationType.ONLINE) {
		return null;
	}

	return (
		<>
			{showLocationType && onLocationTypeChange && (
				<div className="space-y-2">
					<label className="text-sm font-medium text-foreground">{t("location_type")} *</label>
					<Select value={locationType} onValueChange={onLocationTypeChange}>
						<SelectTrigger className={`w-full ${className || ""}`}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className={className}>
							<SelectItem value={EventLocationType.ONLINE}>{t("online")}</SelectItem>
							<SelectItem value={EventLocationType.OFFLINE}>{t("offline")}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}
			{locationType === EventLocationType.OFFLINE && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label htmlFor="eventCity" className="text-sm font-medium text-foreground">
							{t("city")} {showLocationType ? t("events:optional") : "*"}
						</label>
						<Input
							id="eventCity"
							name="eventCity"
							value={city || ""}
							onChange={onCityChange}
							placeholder={t("enter_city")}
							className={className}
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="eventAddress" className="text-sm font-medium text-foreground">
							{t("address")} *
						</label>
						<Input
							id="eventAddress"
							name="eventAddress"
							value={address || ""}
							onChange={onAddressChange}
							placeholder={t("enter_address")}
							className={className}
						/>
					</div>
				</div>
			)}
		</>
	);
};
