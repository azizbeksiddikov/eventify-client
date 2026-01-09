export interface Currency {
	currencyCode: string;
	currencyName: string;
	exchangeRate: number;
	symbol: string;
	updatedAt?: Date;
}

export interface Currencies {
	list: Currency[];
	metaCounter?: { total: number }[];
}
