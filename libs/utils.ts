import numeral from 'numeral';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Message } from './enums/common.enum';
import { smallError, smallSuccess } from './alert';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format('0,0') != '0' ? numeral(value).format('0,0') : '';
};

export const likeHandler = async (
	userId: string,
	likeRefId: string,
	likeTargetHandler: (options?: any) => Promise<any>,
	success_msg: string,
) => {
	try {
		if (!likeRefId || likeRefId === '') return;
		if (!userId || userId === '') throw new Error(Message.NOT_AUTHENTICATED);

		await likeTargetHandler({
			variables: { input: likeRefId },
		});
		await smallSuccess(success_msg);
	} catch (err: unknown) {
		const error = err as Error;
		console.log('ERROR, likeEventHandler:', error.message);
		smallError(error.message);
	}
};
