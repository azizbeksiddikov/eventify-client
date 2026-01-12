"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Pencil, Check, X, AlertCircle } from "lucide-react";
import { GET_CURRENCIES } from "@/apollo/user/query";
import { UPDATE_CURRENCY } from "@/apollo/admin/mutation";
import { CurrencyEntity } from "@/libs/types/currency/currency";
import { CurrencyUpdate } from "@/libs/types/currency/currnecy.update";
import { smallSuccess, smallError } from "@/libs/alert";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/libs/components/ui/card";

export default function CurrenciesModule() {
	const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
	const [newRate, setNewRate] = useState<string>("");

	const { data, loading, error, refetch } = useQuery(GET_CURRENCIES, {
		variables: {
			input: {
				search: {
					isActive: true,
				},
			},
		},
		fetchPolicy: "cache-and-network",
	});

	const [updateCurrency, { loading: updating }] = useMutation(UPDATE_CURRENCY);

	const currencies: CurrencyEntity[] = data?.getCurrencies || [];

	const handleEdit = (currency: CurrencyEntity) => {
		setEditingCurrency(currency._id);
		setNewRate(currency.exchangeRate.toString());
	};

	const handleCancel = () => {
		setEditingCurrency(null);
		setNewRate("");
	};

	const handleSave = async (currencyId: string) => {
		const rate = parseFloat(newRate);
		if (isNaN(rate) || rate <= 0) {
			smallError("Please enter a valid positive number");
			return;
		}

		try {
			const currency = currencies.find((c) => c._id === currencyId);
			if (!currency) {
				smallError("Currency not found");
				return;
			}

			const updateInput: CurrencyUpdate = {
				_id: currencyId,
				exchangeRate: rate,
			};

			await updateCurrency({
				variables: {
					input: updateInput,
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
			<div className="p-4 border border-red-300 rounded-md bg-red-50">
				<div className="flex items-center gap-2">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<span className="text-red-600">Failed to load currencies: {error.message}</span>
				</div>
			</div>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Currency Management</CardTitle>
				<CardDescription>Manage exchange rates for the point system. 1 unit of currency = X points.</CardDescription>
				<div className="p-4 border border-yellow-300 rounded-md bg-yellow-50">
					<div className="flex items-start gap-2">
						<AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
						<div className="text-yellow-800">
							<strong>Important:</strong> Rate changes only affect future ticket purchases. Existing tickets keep their
							original point cost.
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Currency Code</TableHead>
							<TableHead>Exchange Rate (Points per 1 Unit)</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Last Updated</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currencies.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center text-muted-foreground">
									No currencies found
								</TableCell>
							</TableRow>
						) : (
							currencies.map((currency) => (
								<TableRow key={currency._id}>
									<TableCell className="font-medium">{currency.currencyCode}</TableCell>
									<TableCell>
										{editingCurrency === currency._id ? (
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
									<TableCell>
										<span className={`text-sm ${currency.isActive ? "text-green-600" : "text-gray-400"}`}>
											{currency.isActive ? "Active" : "Inactive"}
										</span>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">{formatDate(currency.updatedAt)}</TableCell>
									<TableCell className="text-right">
										{editingCurrency === currency._id ? (
											<div className="flex items-center justify-end gap-2">
												<Button
													size="sm"
													variant="default"
													onClick={() => handleSave(currency._id)}
													disabled={updating}
												>
													<Check className="h-4 w-4" />
												</Button>
												<Button size="sm" variant="outline" onClick={handleCancel} disabled={updating}>
													<X className="h-4 w-4" />
												</Button>
											</div>
										) : (
											<Button size="sm" variant="ghost" onClick={() => handleEdit(currency)} disabled={updating}>
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
