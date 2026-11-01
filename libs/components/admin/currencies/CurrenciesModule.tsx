"use client";

import { CREATE_CURRENCY, REMOVE_CURRENCY, UPDATE_CURRENCY } from "@/apollo/admin/mutation";
import { GET_CURRENCIES } from "@/apollo/user/query";
import { smallError, smallSuccess } from "@/libs/alert";
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
import { Button } from "@/libs/components/ui/button";
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
import { Input } from "@/libs/components/ui/input";
import { Label } from "@/libs/components/ui/label";
import { Switch } from "@/libs/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";
import { friendlyErrorMessage } from "@/libs/errorMessages";
import { CurrencyEntity } from "@/libs/types/currency/currency";
import { CurrencyInput } from "@/libs/types/currency/currency.input";
import { useMutation, useQuery } from "@apollo/client/react";
import { AlertCircle, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export default function CurrenciesModule() {
	const { t } = useTranslation("admin");
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
			smallError(t("currency_invalid_number"));
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

			smallSuccess(t("currency_rate_updated"));
			handleCancel();
		} catch (err) {
			smallError(friendlyErrorMessage(err));
		}
	};

	const handleCreate = async () => {
		const rate = parseFloat(newCurrencyRate);
		if (!newCurrencyCode.trim()) {
			smallError(t("currency_code_required"));
			return;
		}
		if (isNaN(rate) || rate <= 0) {
			smallError(t("currency_rate_invalid"));
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
			smallSuccess(t("currency_created"));
			setIsCreateDialogOpen(false);
			setNewCurrencyCode("");
			setNewCurrencyRate("");
		} catch (err) {
			smallError(friendlyErrorMessage(err));
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
			smallSuccess(t("currency_deleted"));
			setCurrencyToDelete(null);
		} catch (err) {
			smallError(friendlyErrorMessage(err));
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

			smallSuccess(t(!currency.isActive ? "currency_activated" : "currency_deactivated"));
		} catch (err) {
			smallError(friendlyErrorMessage(err));
		}
	};

	const formatDate = (date: Date | undefined) => {
		if (!date) return t("cur_na");
		return new Date(date).toLocaleString();
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-muted-foreground">{t("cur_loading")}</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 border border-red-300 rounded-md bg-red-50">
				<div className="flex items-center gap-2">
					<AlertCircle className="h-4 w-4 text-red-600" />
					<span className="text-red-600">{t("cur_load_failed")}</span>
				</div>
			</div>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="space-y-1.5">
						<CardTitle>{t("cur_title")}</CardTitle>
						<CardDescription>{t("cur_desc")}</CardDescription>
					</div>
					<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
						<DialogTrigger asChild>
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								{t("cur_create")}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("cur_create_title")}</DialogTitle>
								<DialogDescription>{t("cur_create_desc")}</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="currencyCode">{t("cur_code")}</Label>
									<Input
										id="currencyCode"
										placeholder={t("cur_code_placeholder")}
										value={newCurrencyCode}
										onChange={(e) => setNewCurrencyCode(e.target.value)}
										maxLength={3}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="exchangeRate">{t("cur_rate")}</Label>
									<Input
										id="exchangeRate"
										type="number"
										step="0.01"
										min="0"
										placeholder={t("cur_rate_placeholder")}
										value={newCurrencyRate}
										onChange={(e) => setNewCurrencyRate(e.target.value)}
									/>
									<p className="text-sm text-muted-foreground">{t("cur_rate_example")}</p>
								</div>
							</div>
							<DialogFooter>
								<Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={creating}>
									{t("cur_cancel")}
								</Button>
								<Button onClick={handleCreate} disabled={creating}>
									{creating ? t("cur_creating") : t("cur_create")}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="p-4 border border-yellow-300 rounded-md bg-yellow-50 mt-4">
					<div className="flex items-start gap-2">
						<AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
						<div className="text-yellow-800">
							<strong>{t("cur_important")}</strong> {t("cur_important_text")}
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("cur_code")}</TableHead>
							<TableHead>{t("cur_rate")}</TableHead>
							<TableHead>{t("status")}</TableHead>
							<TableHead>{t("cur_last_updated")}</TableHead>
							<TableHead className="text-right">{t("actions")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currencies.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center text-muted-foreground">
									{t("cur_none")}
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
												<span className="text-sm text-muted-foreground">{t("cur_points")}</span>
											</div>
										) : (
											<span>
												{currency.exchangeRate} {t("cur_points")}
											</span>
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
												{currency.isActive ? t("cur_active") : t("cur_inactive")}
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
						<AlertDialogTitle>{t("cur_delete_title")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("cur_delete_confirm", { code: currencyToDelete?.currencyCode })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>{t("cur_cancel")}</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
							{deleting ? t("cur_deleting") : t("cur_delete")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
}
