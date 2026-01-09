"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Pencil, Check, X, AlertCircle } from "lucide-react";
import { GET_CURRENCIES } from "@/apollo/admin/query";
import { UPDATE_CURRENCY_RATE } from "@/apollo/admin/mutation";
import { Currency } from "@/libs/types/currency/currency";
import { smallSuccess, smallError } from "@/libs/alert";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/libs/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/libs/components/ui/card";
import { Alert, AlertDescription } from "@/libs/components/ui/alert";

export default function CurrenciesModule() {
	const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
	const [newRate, setNewRate] = useState<string>("");

	const { data, loading, error, refetch } = useQuery(GET_CURRENCIES, {
		fetchPolicy: "cache-and-network",
	});

	const [updateCurrencyRate, { loading: updating }] = useMutation(UPDATE_CURRENCY_RATE);

	const currencies: Currency[] = data?.getCurrencies || [];

	const handleEdit = (currency: Currency) => {
		setEditingCurrency(currency.currencyCode);
		setNewRate(currency.exchangeRate.toString());
	};

	const handleCancel = () => {
		setEditingCurrency(null);
		setNewRate("");
	};

	const handleSave = async (currencyCode: string) => {
		const rate = parseFloat(newRate);
		if (isNaN(rate) || rate <= 0) {
			smallError("Please enter a valid positive number");
			return;
		}

		try {
			await updateCurrencyRate({
				variables: {
					input: {
						currencyCode,
						exchangeRate: rate,
					},
				},
			});

			await refetch();
			smallSuccess("Exchange rate updated successfully");
			handleCancel();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update exchange rate";
			smallError(errorMessage);
		}
	};

	const formatDate = (date: Date | undefined) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleString();
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-muted-foreground">Loading currencies...</div>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>Failed to load currencies: {error.message}</AlertDescription>
			</Alert>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Currency Management</CardTitle>
				<CardDescription>
					Manage exchange rates for the point system. 1 unit of currency = X points.
				</CardDescription>
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						<strong>Important:</strong> Rate changes only affect future ticket purchases. Existing tickets keep
						their original point cost.
					</AlertDescription>
				</Alert>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Currency Code</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Symbol</TableHead>
							<TableHead>Exchange Rate (Points per 1 Unit)</TableHead>
							<TableHead>Last Updated</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currencies.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center text-muted-foreground">
									No currencies found
								</TableCell>
							</TableRow>
						) : (
							currencies.map((currency) => (
								<TableRow key={currency.currencyCode}>
									<TableCell className="font-medium">{currency.currencyCode}</TableCell>
									<TableCell>{currency.currencyName}</TableCell>
									<TableCell className="text-2xl">{currency.symbol}</TableCell>
									<TableCell>
										{editingCurrency === currency.currencyCode ? (
											<div className="flex items-center gap-2">
												<Input
													type="number"
													step="0.01"
													min="0"
													value={newRate}
													onChange={(e) => setNewRate(e.target.value)}
													className="w-32"
													autoFocus
												/>
												<span className="text-sm text-muted-foreground">points</span>
											</div>
										) : (
											<span>{currency.exchangeRate.toFixed(2)} points</span>
										)}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(currency.updatedAt)}
									</TableCell>
									<TableCell className="text-right">
										{editingCurrency === currency.currencyCode ? (
											<div className="flex items-center justify-end gap-2">
												<Button
													size="sm"
													variant="default"
													onClick={() => handleSave(currency.currencyCode)}
													disabled={updating}
												>
													<Check className="h-4 w-4" />
												</Button>
												<Button size="sm" variant="outline" onClick={handleCancel} disabled={updating}>
													<X className="h-4 w-4" />
												</Button>
											</div>
										) : (
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleEdit(currency)}
												disabled={updating}
											>
												<Pencil className="h-4 w-4" />
											</Button>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
