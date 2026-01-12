import { Direction } from "../../enums/common.enum";

// ============== Currency Creation Input ==============
export interface CurrencyInput {
	// ===== Required Fields =====
	currencyCode: string;

	/**
	 * Exchange rate: USD per internal point
	 * Example: If exchangeRate = 0.01, then 1 internal point = 0.01 USD
	 * This means internal points are the base currency
	 */
	exchangeRate: number;

	// ===== Optional Fields =====
	isActive?: boolean;
}

// ============== Search Inputs ==============
interface CurrencySearch {
	isActive?: boolean;
}

// ============== Inquiry Inputs ==============
export class CurrencyInquiry {
	// ===== Sorting =====
	sort?: string;
	direction?: Direction;

	// ===== Search =====
	search?: CurrencySearch;
}
