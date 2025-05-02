export interface T {
	// @ts-expect-error
	[key: string]: any;
}
