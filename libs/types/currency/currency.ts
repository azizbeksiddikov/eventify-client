export interface CurrencyEntity {
	// ===== Basic Information =====
	_id: string;

	// ===== Currency Information =====
	currencyCode: string;

	/**
	 * Exchange rate: USD per internal point
	 * Example: If exchangeRate = 0.01, then 1 internal point = 0.01 USD
	 * This means internal points are the base currency
	 */
	exchangeRate: number;
	isActive: boolean;

	// ===== Timestamps =====
	createdAt: Date;
	updatedAt: Date;
}
