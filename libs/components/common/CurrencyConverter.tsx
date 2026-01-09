"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { Loader2 } from "lucide-react";
import { GET_MEMBER_POINTS_IN_CURRENCY } from "@/apollo/user/query";
import { formatPointsWithCurrency, formatPoints } from "@/libs/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/libs/components/ui/select";

interface CurrencyConverterProps {
	points: number;
	currencyCode?: string;
	showSelector?: boolean;
}

// Common currencies with their symbols
const CURRENCIES = [
	{ code: "USD", symbol: "$", name: "US Dollar" },
	{ code: "KRW", symbol: "₩", name: "Korean Won" },
	{ code: "EUR", symbol: "€", name: "Euro" },
	{ code: "GBP", symbol: "£", name: "British Pound" },
	{ code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export const CurrencyConverter = ({ points, currencyCode = "USD", showSelector = true }: CurrencyConverterProps) => {
	const [selectedCurrency, setSelectedCurrency] = useState(currencyCode);
	const [cachedConversions, setCachedConversions] = useState<Record<string, number>>({});

	const { data, loading } = useQuery(GET_MEMBER_POINTS_IN_CURRENCY, {
		variables: { input: selectedCurrency },
		skip: !points || points === 0,
		fetchPolicy: "cache-first",
	});

	useEffect(() => {
		if (data?.getMemberPointsInCurrency !== undefined) {
			setCachedConversions((prev) => ({
				...prev,
				[selectedCurrency]: data.getMemberPointsInCurrency,
			}));
		}
	}, [data, selectedCurrency]);

	const currencyInfo = CURRENCIES.find((c) => c.code === selectedCurrency);
	const currencyValue = cachedConversions[selectedCurrency] ?? data?.getMemberPointsInCurrency;

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
			) : currencyValue && currencyInfo ? (
				<span className="font-semibold">
					{formatPointsWithCurrency(points, currencyValue, currencyInfo.code, currencyInfo.symbol)}
				</span>
			) : (
				<span className="font-semibold">{formatPoints(points)}</span>
			)}

			{showSelector && (
				<Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
					<SelectTrigger className="w-[100px] h-8">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{CURRENCIES.map((currency) => (
							<SelectItem key={currency.code} value={currency.code}>
								{currency.code}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
};
