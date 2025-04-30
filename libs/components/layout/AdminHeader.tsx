import Link from 'next/link';
import { useState } from 'react';
import { Button, buttonVariants } from '@/libs/components/ui/button';
import type { Member } from '@/libs/types/member/member';
import { MemberType, MemberStatus } from '@/libs/enums/member.enum';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/libs/components/ui/dropdown-menu';
import { ModeToggle } from '../ui/mode-toggle';
import { Logo } from '../ui/logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/libs/utils';
import { UserNav } from './UserNav';

const navLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/events', label: 'Events' },
	{ href: '/groups', label: 'Groups' },
	{ href: '/organizers', label: 'Organizers' },
	{ href: '/help', label: 'Help' },
	{ href: '/admin', label: 'Admin' },
];

const Header = () => {
	const pathname = usePathname();

	const languages = [
		{ code: 'en', name: 'English', flag: '🇺🇸' },
		{ code: 'ru', name: 'Russian', flag: '🇷🇺' },
		{ code: 'uz', name: 'Uzbek', flag: '🇺🇿' },
		{ code: 'ko', name: 'Korean', flag: '🇰🇷' },
	];

	const [currentLanguage, setCurrentLanguage] = useState('en');

	const handleLanguageChange = (langCode: string) => {
		setCurrentLanguage(langCode);
	};

	const [authMember, setUser] = useState<Member | null>({
		_id: '1',
		username: 'johndoe',
		memberEmail: 'john@example.com',
		memberFullName: 'John Doe',
		memberType: MemberType.USER,
		memberStatus: MemberStatus.ACTIVE,
		emailVerified: true,
		memberImage: '', // Empty string to test fallback
		memberPoints: 100,
		memberLikes: 50,
		memberFollowings: 20,
		memberFollowers: 30,
		memberViews: 1000,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const handleLogout = () => {
		setUser(null);
	};

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
							{link.label}
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
						<DropdownMenuContent align="end" className="w-40">
							{languages.map((lang) => (
								<DropdownMenuItem
									key={lang.code}
									className={`${currentLanguage === lang.code ? 'bg-background font-medium' : ''} cursor-pointer`}
									onClick={() => handleLanguageChange(lang.code)}
								>
									{lang.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Menu */}
					{authMember ? (
						<UserNav handleLogout={handleLogout} authMember={authMember} />
					) : (
						<div className="flex items-center gap-4">
							<Link href="/login">
								<Button variant="outline" className="text-sm  h-9 px-4">
									Login
								</Button>
							</Link>
							<Link href="/signup">
								<Button className="text-sm 0 h-9 px-4">Sign Up</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
