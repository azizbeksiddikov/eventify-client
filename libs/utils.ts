import numeral from 'numeral';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Message } from '@/libs/enums/common.enum';
import { smallError, smallSuccess } from '@/libs/alert';

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

export const formatDateHandler = (dateString: string | Date) => {
	const d = new Date(dateString);
	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const formatPhoneNumber = (value: string) => {
	// Remove all non-digit characters
	const numbers = value.replace(/\D/g, '');

	// Format the number as XXX-XXXX-XXXX
	// 012-3456-78910
	if (numbers.length <= 3) {
		return numbers;
	} else if (numbers.length <= 7) {
		return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
	} else {
		return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
	}
};

export const readDate = (date: Date): string => {
	return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const parseDate = (dateStr: string | undefined): Date | undefined => {
	if (!dateStr) return undefined;
	const date = dateStr.split('-').map(Number);
	if (isNaN(date[0]) || isNaN(date[1]) || isNaN(date[2])) return undefined;
	return new Date(date[0], date[1] - 1, date[2]);
};
