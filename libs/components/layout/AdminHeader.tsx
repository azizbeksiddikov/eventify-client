import Link from 'next/link';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, buttonVariants } from '@/libs/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/libs/components/ui/dropdown-menu';
import { ModeToggle } from '@/libs/components/ui/mode-toggle';
import { Logo } from '@/libs/components/ui/logo';
import { usePathname } from 'next/navigation';
import { useRouter, withRouter } from 'next/router';

import { cn } from '@/libs/utils';
import { UserNav } from './UserNav';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '@/apollo/store';
import { getJwtToken, updateUserInfo } from '@/libs/auth';
import { Member } from '@/libs/types/member/member';

const navLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/events', label: 'Events' },
	{ href: '/groups', label: 'Groups' },
	{ href: '/organizers', label: 'Organizers' },
	{ href: '/help', label: 'Help' },
	{ href: '/_admin', label: 'Admin' },
];

const Header = () => {
	const pathname = usePathname();
	const authMember = useReactiveVar(userVar) as Member;
	const { t } = useTranslation('common');
	const router = useRouter();
	const [currentLanguage, setCurrentLanguage] = useState<string>('en');

	const languages = [
		{ code: 'en', name: 'English', flag: '🇺🇸' },
		{ code: 'ru', name: 'Russian', flag: '🇷🇺' },
		{ code: 'uz', name: 'Uzbek', flag: '🇺🇿' },
		{ code: 'ko', name: 'Korean', flag: '🇰🇷' },
	];

	/** LIFECYCLES **/
	// Set current language
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setCurrentLanguage('en');
		} else {
			setCurrentLanguage(localStorage.getItem('locale') || 'en');
		}
	}, [router]);

	// Update user info
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const handleLanguageChange = useCallback(
		async (languageCode: string) => {
			setCurrentLanguage(languageCode);
			localStorage.setItem('locale', languageCode);
			await router.push(router.asPath, undefined, { locale: languageCode });
		},
		[router],
	);

	return (
		<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b ">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-3 hover:scale-95 transition-transform duration-300">
					<Logo className="h-8 w-8" />
					<span className="text-xl font-semibold text-foreground">Eventify</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="flex items-center gap-8 ">
					{navLinks.map((link, index) => (
						<Link
							key={index}
							href={link.href}
							className={`text-sm font-medium transition-colors duration-300 ${
								pathname === link.href
									? 'text-foneground font-semibold underline underline-offset-6'
									: 'text-muted-foreground hover:text-foreground'
							}`}
						>
							{t(`${link.label}`)}
						</Link>
					))}
				</nav>

				{/* Auth & Lang & Theme */}
				<div className="flex items-center gap-3">
					{/* Theme Mode Switcher */}
					<ModeToggle />

					{/* Language Selector */}
					<DropdownMenu>
						<DropdownMenuTrigger
							className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'offdet-0 text-xl h-10 w-10')}
						>
							{languages.find((lang) => lang.code === currentLanguage)?.flag || '🌐'}
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{languages.map((language) => (
								<DropdownMenuItem
									key={language.code}
									className={`${currentLanguage === language.code ? 'bg-background ' : ''} cursor-pointer w-full`}
									onClick={() => handleLanguageChange(language.code)}
								>
									{language.name} {'  '}
									{language.flag}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Menu */}
					{authMember ? (
						<UserNav authMember={authMember} />
					) : (
						<div className="flex items-center gap-4">
							<Link href="/auth/login">
								<Button variant="outline" className="text-sm  h-9 px-4">
									Login
								</Button>
							</Link>
							<Link href="auth/signup">
								<Button className="text-sm 0 h-9 px-4">Sign Up</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

// export default withRouter(Header);
export default withRouter(Header);
