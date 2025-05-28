import numeral from 'numeral';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Message } from '@/libs/enums/common.enum';
import { smallError, smallInfo, smallSuccess } from '@/libs/alert';
import { TFunction } from 'i18next';
import { gql } from '@apollo/client';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format('0,0') != '0' ? numeral(value).format('0,0') : '';
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

// Simple debounce timers for likes
const debounceTimers: { [key: string]: NodeJS.Timeout } = {};
const clickCounts: { [key: string]: number } = {};

export const likeEvent = async (
	memberId: string,
	likeRefId: string,
	likeTargetEvent: (options?: any) => Promise<any>,
	cache?: any,
) => {
	try {
		if (!likeRefId || likeRefId === '') return;
		if (!memberId || memberId === '') throw new Error(Message.NOT_AUTHENTICATED);

		const eventKey = `Event:${likeRefId}`;

		// Get current state
		const currentData = cache?.readFragment({
			id: eventKey,
			fragment: gql`
				fragment EventLikeData on Event {
					eventLikes
					meLiked
				}
			`,
		});

		const currentLikeState = currentData?.meLiked?.[0]?.myFavorite || false;
		const newLikeState = !currentLikeState;

		// Update UI immediately
		if (cache) {
			cache.modify({
				id: eventKey,
				fields: {
					eventLikes(existing: number = 0) {
						return newLikeState ? existing + 1 : existing - 1;
					},
					meLiked() {
						return newLikeState ? [{ memberId, likeRefId, myFavorite: true, __typename: 'MeLiked' }] : [];
					},
				},
			});
		}

		// Clear existing timer
		if (debounceTimers[likeRefId]) {
			clearTimeout(debounceTimers[likeRefId]);
		}

		// Count clicks
		clickCounts[likeRefId] = (clickCounts[likeRefId] || 0) + 1;

		// Debounce backend call
		debounceTimers[likeRefId] = setTimeout(async () => {
			try {
				const isOddClicks = clickCounts[likeRefId] % 2 === 1;

				if (isOddClicks) await likeTargetEvent({ variables: { input: likeRefId } });
			} catch (err: any) {
				// Revert on error
				if (cache) {
					cache.modify({
						id: eventKey,
						fields: {
							eventLikes(existing: number = 0) {
								return currentLikeState ? existing + 1 : existing - 1;
							},
							meLiked() {
								return currentLikeState ? [{ memberId, likeRefId, myFavorite: true, __typename: 'MeLiked' }] : [];
							},
						},
					});
				}
				smallError(err.message);
			} finally {
				delete debounceTimers[likeRefId];
				delete clickCounts[likeRefId];
			}
		}, 500);
	} catch (err: any) {
		delete debounceTimers[likeRefId];
		delete clickCounts[likeRefId];
		smallError(err.message);
	}
};

export const likeMember = async (
	memberId: string,
	likeRefId: string,
	likeTargetMember: (options?: any) => Promise<any>,
	cache?: any,
) => {
	try {
		if (!likeRefId || likeRefId === '') return;
		if (!memberId || memberId === '') throw new Error(Message.NOT_AUTHENTICATED);

		const memberKey = `Member:${likeRefId}`;

		// Get current state
		const currentData = cache?.readFragment({
			id: memberKey,
			fragment: gql`
				fragment MemberLikeData on Member {
					memberLikes
					meLiked
				}
			`,
		});

		const currentLikeState = currentData?.meLiked?.[0]?.myFavorite || false;
		const newLikeState = !currentLikeState;

		// Update UI immediately
		if (cache) {
			cache.modify({
				id: memberKey,
				fields: {
					memberLikes(existing: number = 0) {
						return newLikeState ? existing + 1 : existing - 1;
					},
					meLiked() {
						return newLikeState ? [{ memberId, likeRefId, myFavorite: true, __typename: 'MeLiked' }] : [];
					},
				},
			});
		}

		// Clear existing timer
		if (debounceTimers[likeRefId]) {
			clearTimeout(debounceTimers[likeRefId]);
		}

		// Count clicks
		clickCounts[likeRefId] = (clickCounts[likeRefId] || 0) + 1;

		// Debounce backend call
		debounceTimers[likeRefId] = setTimeout(async () => {
			try {
				const isOddClicks = clickCounts[likeRefId] % 2 === 1;

				if (isOddClicks) await likeTargetMember({ variables: { input: likeRefId } });
			} catch (err: any) {
				// Revert on error
				if (cache) {
					cache.modify({
						id: memberKey,
						fields: {
							memberLikes(existing: number = 0) {
								return currentLikeState ? existing + 1 : existing - 1;
							},
							meLiked() {
								return currentLikeState ? [{ memberId, likeRefId, myFavorite: true, __typename: 'MeLiked' }] : [];
							},
						},
					});
				}
				smallError(err.message);
				console.log('ERROR, likeMemberHandler:', err.message);
			} finally {
				delete debounceTimers[likeRefId];
				delete clickCounts[likeRefId];
			}
		}, 500);
	} catch (err: any) {
		delete debounceTimers[likeRefId];
		delete clickCounts[likeRefId];
		smallError(err.message);
	}
};

export const likeGroup = async (
	memberId: string,
	likeRefId: string,
	likeTargetGroup: (options?: any) => Promise<any>,
	cache?: any,
) => {
	try {
		if (!likeRefId || likeRefId === '') return;
		if (!memberId || memberId === '') throw new Error(Message.NOT_AUTHENTICATED);

		const groupKey = `Group:${likeRefId}`;

		// Get current state
		const currentData = cache?.readFragment({
			id: groupKey,
			fragment: gql`
				fragment GroupLikeData on Group {
					groupLikes
					meLiked
				}
			`,
		});

		const currentLikeState = currentData?.meLiked?.[0]?.myFavorite || false;
		const newLikeState = !currentLikeState;

		// Update UI immediately
		if (cache) {
			cache.modify({
				id: groupKey,
				fields: {
					groupLikes(existing: number = 0) {
						return newLikeState ? existing + 1 : existing - 1;
					},
					meLiked() {
						return newLikeState ? [{ memberId, likeRefId, myFavorite: true, __typename: 'MeLiked' }] : [];
					},
				},
			});
		}

		// Clear existing timer
		if (debounceTimers[likeRefId]) {
			clearTimeout(debounceTimers[likeRefId]);
		}

		// Count clicks
		clickCounts[likeRefId] = (clickCounts[likeRefId] || 0) + 1;

		// Debounce backend call
		debounceTimers[likeRefId] = setTimeout(async () => {
			try {
				const isOddClicks = clickCounts[likeRefId] % 2 === 1;

				if (isOddClicks) await likeTargetGroup({ variables: { input: likeRefId } });
			} catch (err: any) {
				// Revert on error
				if (cache) {
					cache.modify({
						id: groupKey,
						fields: {
							groupLikes(existing: number = 0) {
								return currentLikeState ? existing + 1 : existing - 1;
							},
							meLiked() {
								return currentLikeState ? [{ memberId, likeRefId, myFavorite: true, __typename: 'MeLiked' }] : [];
							},
						},
					});
				}
				smallError(err.message);
				console.log('ERROR, likeGroupHandler:', err.message);
			} finally {
				delete debounceTimers[likeRefId];
				delete clickCounts[likeRefId];
			}
		}, 500);
	} catch (err: any) {
		delete debounceTimers[likeRefId];
		delete clickCounts[likeRefId];
		smallError(err.message);
	}
};

// Subscribe/Unsubscribe
export const followMember = async (
	memberId: string,
	followRefId: string,
	followTargetMember: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!followRefId) return;
		if (!memberId || memberId === '') throw new Error(Message.NOT_AUTHENTICATED);

		await followTargetMember({
			variables: { input: followRefId },
		});

		await smallSuccess(t('Member subscribed successfully'));
	} catch (err: any) {
		smallError(err.message);
		console.log('ERROR, subscribeHandler:', err.message);
	}
};

export const unfollowMember = async (
	memberId: string,
	followRefId: string,
	unfollowTargetMember: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!followRefId) return;
		if (!memberId || memberId === '') throw new Error(Message.NOT_AUTHENTICATED);

		await unfollowTargetMember({
			variables: { input: followRefId },
		});

		await smallInfo(t('Member unsubscribed successfully'));
	} catch (err: any) {
		smallError(err.message);
		console.log('ERROR, unsubscribeHandler:', err.message);
	}
};

// Join/Leave group
export const joinGroup = async (
	memberId: string,
	groupId: string,
	joinTargetGroup: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!groupId) return;
		if (!memberId || memberId === '') throw new Error(Message.NOT_AUTHENTICATED);

		await joinTargetGroup({
			variables: { input: groupId },
		});

		await smallSuccess(t('Group joined successfully'));
	} catch (err: any) {
		smallError(err.message);
		console.log('ERROR, joinGroupHandler:', err.message);
	}
};

export const leaveGroup = async (
	memberId: string,
	groupId: string,
	leaveTargetGroup: (options?: any) => Promise<any>,
	t: TFunction,
) => {
	try {
		if (!groupId) return;
		if (!memberId || memberId === '') throw new Error(Message.NOT_AUTHENTICATED);

		await leaveTargetGroup({
			variables: { input: groupId },
		});

		await smallSuccess(t('Group left successfully'));
	} catch (err: any) {
		smallError(err.message);
		console.log('ERROR, leaveGroupHandler:', err.message);
	}
};
