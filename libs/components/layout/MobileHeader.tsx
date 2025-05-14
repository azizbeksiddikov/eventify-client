import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Menu, X, Home, Calendar, Users, User2, HelpCircle, ShieldAlert } from 'lucide-react';

import { useRouter, withRouter } from 'next/router';

import { Button, buttonVariants } from '@/libs/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/libs/components/ui/sheet';
import { ModeToggle } from '@/libs/components/ui/mode-toggle';
import { Logo } from '@/libs/components/ui/logo';
import { UserNav } from '@/libs/components/layout/UserNav';
import { NotificationDropdown } from '@/libs/components/layout/NotificationDropdown';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/libs/components/ui/dropdown-menu';

import { cn } from '@/libs/utils';
import { userVar } from '@/apollo/store';
import { getJwtToken, updateUserInfo } from '@/libs/auth';
import type { Member } from '@/libs/types/member/member';
import { MemberType } from '@/libs/enums/member.enum';

const navLinks = [
	{ href: '/', label: 'Home', icon: Home },
	{ href: '/event', label: 'Events', icon: Calendar },
	{ href: '/group', label: 'Groups', icon: Users },
	{ href: '/organizer', label: 'Organizers', icon: User2 },
	{ href: '/help', label: 'Help', icon: HelpCircle },
];
const adminLink = { href: '/_admin', label: 'Admin', icon: ShieldAlert };

const MobileHeader = () => {
	const router = useRouter();
	const pathname = usePathname();
	const authMember = useReactiveVar(userVar) as unknown as Member;
	const { t } = useTranslation('common');
	const [isOpen, setIsOpen] = useState(false);
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
	const languageHandler = useCallback(
		async (languageCode: string) => {
			setCurrentLanguage(languageCode);
			localStorage.setItem('locale', languageCode);
			await router.push(router.asPath, undefined, { locale: languageCode });
		},
		[router],
	);

	return (
		<header
			className={
				'sticky top-0 z-50 transition-all duration-300 backdrop-blur-md px-4 flex items-center justify-between h-16 w-full'
			}
		>
			{/* Logo */}
			<Link href="/" className="flex items-center gap-3 hover:scale-95 transition-transform duration-300">
				<Logo className="h-6 w-6" />
				<span className="text-xl font-semibold text-foreground">Eventify</span>
			</Link>

			{/* Mobile Controls */}
			<div className="flex items-center gap-2">
				{/* Auth buttons on mobile */}
				{authMember._id ? (
					<>
						{/* Notification */}
						<NotificationDropdown />
						<UserNav authMember={authMember} />
					</>
				) : (
					<Link href="/auth/login">
						<Button
							variant="ghost"
							size="sm"
							className="text-sm mr-2 rounded-full hover:bg-accent hover:text-accent-foreground"
						>
							{t('Login')}
						</Button>
					</Link>
				)}

				{/* Mobile Menu */}
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-full hover:bg-accent hover:text-accent-foreground"
						>
							<Menu className="h-5 w-5" />
						</Button>
					</SheetTrigger>

					<SheetContent side="right" className=" backdrop-blur-md gap-0">
						<SheetHeader className="mx-0 px-8 py-4 border-b border-border ">
							<SheetTitle className="flex items-center justify-between m-0 p-0">
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
												className={`${currentLanguage === language.code ? 'bg-background ' : ''} cursor-pointer`}
												onClick={() => languageHandler(language.code)}
											>
												{language.name}
												{language.flag}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<SheetClose className="rounded-full p-1.5 hover:bg-accent">
									<X className="h-5 w-5" />
								</SheetClose>
							</SheetTitle>
						</SheetHeader>

						{/* Mobile Navigation Links */}
						<nav className="flex flex-col space-y-1 py-4">
							{navLinks.map((link, index) => (
								<Link
									key={index}
									href={link.href}
									className={cn(
										pathname === link.href
											? 'bg-primary/10 text-primary font-medium'
											: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
									)}
									onClick={() => setIsOpen(false)}
								>
									<div className="flex items-center h-12 px-4 gap-3 group relative">
										<link.icon
											className={cn(
												'h-5 w-5 transition-colors duration-200',
												pathname === link.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
											)}
										/>
										<span
											className={cn(
												'text-sm font-medium transition-colors duration-200',
												pathname === link.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
											)}
										>
											{t(`${link.label}`)}
										</span>
										{pathname === link.href && (
											<div className="absolute right-0 top-0 h-full w-1.5 bg-primary rounded-full" />
										)}
									</div>
								</Link>
							))}
							{authMember.memberType === MemberType.ADMIN && (
								<Link
									href={adminLink.href}
									className={cn(
										pathname === adminLink.href
											? 'bg-primary/10 text-primary font-medium'
											: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
									)}
									onClick={() => setIsOpen(false)}
								>
									<div className="flex items-center h-12 px-4 gap-3 group relative">
										<adminLink.icon
											className={cn(
												'h-5 w-5 transition-colors duration-200',
												pathname === adminLink.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
											)}
										/>
										<span
											className={cn(
												'text-sm font-medium transition-colors duration-200',
												pathname === adminLink.href ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
											)}
										>
											{t(`${adminLink.label}`)}
										</span>
										{pathname === adminLink.href && (
											<div className="absolute right-0 top-0 h-full w-1.5 bg-primary rounded-full" />
										)}
									</div>
								</Link>
							)}
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
};

export default withRouter(MobileHeader);
