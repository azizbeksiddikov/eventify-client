"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Pencil, Check, X, AlertCircle, Plus, Trash2 } from "lucide-react";
import { GET_CURRENCIES } from "@/apollo/user/query";
import { CREATE_CURRENCY, UPDATE_CURRENCY, REMOVE_CURRENCY } from "@/apollo/admin/mutation";
import { CurrencyEntity } from "@/libs/types/currency/currency";
import { CurrencyUpdate } from "@/libs/types/currency/currnecy.update";
import { CurrencyInput } from "@/libs/types/currency/currency.input";
import { smallSuccess, smallError } from "@/libs/alert";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Label } from "@/libs/components/ui/label";
import { Switch } from "@/libs/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/libs/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/libs/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/libs/components/ui/alert-dialog";

export default function CurrenciesModule() {
	const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
	const [newRate, setNewRate] = useState<string>("");
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [newCurrencyCode, setNewCurrencyCode] = useState("");
	const [newCurrencyRate, setNewCurrencyRate] = useState("");
	const [currencyToDelete, setCurrencyToDelete] = useState<CurrencyEntity | null>(null);

	const { data, loading, error, refetch } = useQuery(GET_CURRENCIES, {
		variables: {
			input: {
				search: {},
			},
		},
		fetchPolicy: "cache-and-network",
	});

	const [createCurrency, { loading: creating }] = useMutation(CREATE_CURRENCY);
	const [updateCurrency, { loading: updating }] = useMutation(UPDATE_CURRENCY);
	const [removeCurrency, { loading: deleting }] = useMutation(REMOVE_CURRENCY);

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
			await updateCurrency({
				variables: {
					input: {
						_id: currencyId,
						exchangeRate: rate,
					},
				},
			});

			smallSuccess("Exchange rate updated successfully");
			handleCancel();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update exchange rate";
			smallError(errorMessage);
		}
	};

	const handleCreate = async () => {
		const rate = parseFloat(newCurrencyRate);
		if (!newCurrencyCode.trim()) {
			smallError("Please enter a currency code");
			return;
		}
		if (isNaN(rate) || rate <= 0) {
			smallError("Please enter a valid positive exchange rate");
			return;
		}

		try {
			const createInput: CurrencyInput = {
				currencyCode: newCurrencyCode.toUpperCase().trim(),
				exchangeRate: rate,
				isActive: true,
			};

			await createCurrency({
				variables: {
					input: createInput,
				},
			});

			await refetch();
			smallSuccess("Currency created successfully");
			setIsCreateDialogOpen(false);
			setNewCurrencyCode("");
			setNewCurrencyRate("");
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create currency";
			smallError(errorMessage);
		}
	};

	const handleDelete = async () => {
		if (!currencyToDelete) return;

		try {
			await removeCurrency({
				variables: {
					input: currencyToDelete._id,
				},
			});

			await refetch();
			smallSuccess("Currency deleted successfully");
			setCurrencyToDelete(null);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to delete currency";
			smallError(errorMessage);
		}
	};

	const handleToggleActive = async (currency: CurrencyEntity) => {
		try {
			await updateCurrency({
				variables: {
					input: {
						_id: currency._id,
						isActive: !currency.isActive,
					},
				},
			});

			smallSuccess(`Currency ${!currency.isActive ? "activated" : "deactivated"} successfully`);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to update currency status";
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
				<div className="flex items-start justify-between">
					<div className="space-y-1.5">
						<CardTitle>Currency Management</CardTitle>
						<CardDescription>
							Manage exchange rates for the point system. 1 unit of currency = X points.
						</CardDescription>
					</div>
					<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Create Currency
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create New Currency</DialogTitle>
								<DialogDescription>Add a new currency to the point system.</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="currencyCode">Currency Code</Label>
									<Input
										id="currencyCode"
										placeholder="e.g., USD, EUR, GBP"
										value={newCurrencyCode}
										onChange={(e) => setNewCurrencyCode(e.target.value)}
										maxLength={3}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="exchangeRate">Exchange Rate (Points per 1 Unit)</Label>
									<Input
										id="exchangeRate"
										type="number"
										step="0.01"
										min="0"
										placeholder="e.g., 100"
										value={newCurrencyRate}
										onChange={(e) => setNewCurrencyRate(e.target.value)}
									/>
									<p className="text-sm text-muted-foreground">Example: If 1 USD = 100 points, enter 100</p>
								</div>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={creating}>
									Cancel
								</Button>
								<Button onClick={handleCreate} disabled={creating}>
									{creating ? "Creating..." : "Create Currency"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="p-4 border border-yellow-300 rounded-md bg-yellow-50 mt-4">
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
										<div className="flex items-center gap-2">
											<Switch
												checked={currency.isActive}
												onCheckedChange={() => handleToggleActive(currency)}
												disabled={updating || deleting}
											/>
											<span className={`text-sm ${currency.isActive ? "text-green-600" : "text-gray-400"}`}>
												{currency.isActive ? "Active" : "Inactive"}
											</span>
										</div>
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
											<div className="flex items-center justify-end gap-2">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleEdit(currency)}
													disabled={updating || deleting}
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => setCurrencyToDelete(currency)}
													disabled={updating || deleting}
													className="text-red-600 hover:text-red-700 hover:bg-red-50"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</CardContent>
			<AlertDialog open={!!currencyToDelete} onOpenChange={(open) => !open && setCurrencyToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Currency</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete <strong>{currencyToDelete?.currencyCode}</strong>? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
							{deleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}
