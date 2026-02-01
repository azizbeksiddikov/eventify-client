"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { GET_MEMBER_POINTS_IN_CURRENCY, GET_CURRENCIES } from "@/apollo/user/query";
import { formatPointsWithCurrency, formatPoints } from "@/libs/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { CurrencyEntity } from "@/libs/types/currency/currency";

interface CurrencyConverterProps {
	points: number;
	currencyCode?: string;
	showSelector?: boolean;
}

export const CurrencyConverter = ({ points, currencyCode, showSelector = true }: CurrencyConverterProps) => {
	const { data: currenciesData } = useQuery(GET_CURRENCIES, {
		variables: {
			input: {
				search: {
					isActive: true,
				},
			},
		},
		fetchPolicy: "cache-and-network",
	});

	const currencies: CurrencyEntity[] = currenciesData?.getCurrencies || [];

	// Compute default currency: use prop if provided, otherwise USD if available, otherwise first active currency
	const computedDefaultCurrency =
		currencyCode || currencies.find((c) => c.currencyCode === "USD")?.currencyCode || currencies[0]?.currencyCode || "";

	const [selectedCurrency, setSelectedCurrency] = useState<string>(() => currencyCode || "");

	// Use computed default if selectedCurrency is empty, otherwise use selectedCurrency
	const currentCurrency = selectedCurrency || computedDefaultCurrency;

	const { data, loading } = useQuery(GET_MEMBER_POINTS_IN_CURRENCY, {
		variables: { input: currentCurrency },
		skip: !points || points === 0 || !currentCurrency,
		fetchPolicy: "cache-first",
	});

	const currencyValue = data?.getMemberPointsInCurrency;

	if (!points || points === 0) {
		return <span className="text-muted-foreground">0 Points</span>;
	}

	return (
		<div className="flex items-center gap-2">
			{loading && !currencyValue ? (
				<div className="flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>{formatPoints(points)}</span>
				</div>
			) : currencyValue ? (
				<span className="font-semibold">{formatPointsWithCurrency(points, currencyValue, currentCurrency)}</span>
			) : (
				<span className="font-semibold">{formatPoints(points)}</span>
			)}

			{showSelector && currencies.length > 0 && (
				<Select value={currentCurrency} onValueChange={setSelectedCurrency}>
					<SelectTrigger className="w-[100px] h-8">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{currencies.map((currency) => (
							<SelectItem key={currency.currencyCode} value={currency.currencyCode}>
								{currency.currencyCode}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
};
