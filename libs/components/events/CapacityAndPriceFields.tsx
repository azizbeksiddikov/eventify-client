"use client";

import { useTranslation } from "next-i18next";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { Currency } from "@/libs/enums/common.enum";

interface CapacityAndPriceFieldsProps {
	capacity: number | undefined;
	price: number | undefined;
	currency: Currency;
	onCapacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onCurrencyChange: (currency: Currency) => void;
	className?: string;
}

export const CapacityAndPriceFields = ({
	capacity,
	price,
	currency,
	onCapacityChange,
	onPriceChange,
	onCurrencyChange,
	className,
}: CapacityAndPriceFieldsProps) => {
	const { t } = useTranslation("events");

	return (
		<div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className || ""}`}>
			<div className="space-y-2">
				<label htmlFor="eventCapacity" className="text-sm font-medium text-foreground">
					{t("events:capacity_number")} {t("events:optional")}
				</label>
				<Input
					id="eventCapacity"
					name="eventCapacity"
					type="number"
					min="0"
					value={capacity === undefined ? "" : String(capacity)}
					onChange={onCapacityChange}
					placeholder={t("event_capacity_placeholder")}
					className={className}
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="eventPrice" className="text-sm font-medium text-foreground">
					{t("price")} {t("events:optional")}
				</label>
				<div className="flex gap-2">
					<Input
						id="eventPrice"
						name="eventPrice"
						type="number"
						min="0"
						value={price === undefined ? "" : String(price)}
						onChange={onPriceChange}
						placeholder={t("enter_event_price")}
						className={className}
					/>
					<Select value={currency || Currency.USD} onValueChange={onCurrencyChange}>
						<SelectTrigger className={`w-24 ${className || ""}`}>
							<SelectValue placeholder={t("currency")} />
						</SelectTrigger>
						<SelectContent className={className}>
							{Object.values(Currency).map((curr) => (
								<SelectItem key={curr} value={curr} className={className}>
									{curr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};
