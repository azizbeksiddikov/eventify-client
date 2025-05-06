import decodeJWT from 'jwt-decode';
import { initializeApollo } from '@/apollo/client';
import { userVar } from '@/apollo/store';

import { LOGIN, SIGN_UP } from '@/apollo/user/mutation';
import { CustomJwtPayload } from '@/libs/types/customJwtPayload';
import { Message } from '@/libs/enums/common.enum';
import { MemberType } from '@/libs/enums/member.enum';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export const logIn = async (username: string, memberPassword: string): Promise<void> => {
	try {
		const { jwtToken } = await requestJwtToken({ username, memberPassword });

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err) {
		console.warn('login err', err);
		deleteStorage();
		deleteUserInfo();
		throw new Error(Message.LOGIN_FAILED);
	}
};

const requestJwtToken = async ({
	username,
	memberPassword,
}: {
	username: string;
	memberPassword: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { username: username, memberPassword: memberPassword } },
			fetchPolicy: 'network-only',
		});

		const { accessToken } = result?.data?.login;

		return { jwtToken: accessToken };
	} catch (err: any) {
		throw new Error(err.message);
	}
};

export const signUp = async (
	username: string,
	memberPassword: string,
	memberEmail: string,
	memberFullName: string,
	memberType: MemberType,
): Promise<void> => {
	try {
		const { jwtToken } = await requestSignUpJwtToken({
			username,
			memberPassword,
			memberEmail,
			memberFullName,
			memberType,
		});

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	} catch (err: any) {
		console.warn('signup err', err);
		deleteStorage();
		deleteUserInfo();
		throw new Error(err.message);
	}
};

const requestSignUpJwtToken = async ({
	username,
	memberPassword,
	memberEmail,
	memberFullName,
	memberType,
}: {
	username: string;
	memberPassword: string;
	memberEmail: string;
	memberFullName: string;
	memberType: MemberType;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: { username, memberPassword, memberEmail, memberFullName, memberType },
			},
			fetchPolicy: 'network-only',
		});

		const { accessToken } = result?.data?.signup;

		return { jwtToken: accessToken };
	} catch (err: any) {
		console.log('request token err', err.graphQLErrors);
		throw new Error(err.message);
	}
};

export const updateStorage = ({ jwtToken }: { jwtToken: string }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const updateUserInfo = (jwtToken: string) => {
	if (!jwtToken) return false;

	const claims = decodeJWT<CustomJwtPayload>(jwtToken);
	userVar({
		_id: claims._id ?? '',
		username: claims.username ?? '',
		memberEmail: claims.memberEmail ?? '',
		memberPhone: claims.memberPhone ?? '',
		memberFullName: claims.memberFullName ?? '',
		memberType: claims.memberType ?? '',
		emailVerified: claims.emailVerified ?? false,
		memberDesc: claims.memberDesc ?? '',
		memberImage: claims.memberImage ?? '',
		memberPoints: claims.memberPoints ?? 0,
		memberLikes: claims.memberLikes ?? 0,
		memberFollowings: claims.memberFollowings ?? 0,
		memberFollowers: claims.memberFollowers ?? 0,
		memberViews: claims.memberViews ?? 0,
		eventOrganizedCount: claims.eventOrganizedCount ?? 0,
		memberStatus: claims.memberStatus ?? '',
		memberGroups: claims.memberGroups ?? 0,
		memberEvents: claims.memberEvents ?? 0,
		memberRank: claims.memberRank ?? 0,
		createdAt: claims.createdAt ?? new Date(),
		updatedAt: claims.updatedAt ?? new Date(),
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.reload();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({
		_id: '',
		username: '',
		memberEmail: '',
		memberPhone: '',
		memberFullName: '',
		memberType: '',
		memberStatus: '',
		emailVerified: false,
		memberDesc: '',
		memberImage: '',
		memberPoints: 0,
		memberLikes: 0,
		memberFollowings: 0,
		memberFollowers: 0,
		memberViews: 0,
		eventOrganizedCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
		memberGroups: 0,
		memberEvents: 0,
		memberRank: 0,
	});
};
