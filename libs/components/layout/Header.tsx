import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface MemberInput {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	profileImage?: string;
}

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<MemberInput | null>(null);

	const handleLogout = () => {
		setIsAuthenticated(false);
		setUser(null);
	};

	return (
		<header className="bg-background border-b">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<Image src="/logo.png" alt="Eventify Logo" width={40} height={40} />
						<span className="text-xl font-bold">Eventify</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-6">
						<Link href="/events" className="text-foreground hover:text-primary">
							Events
						</Link>
						<Link href="/groups" className="text-foreground hover:text-primary">
							Groups
						</Link>
						<Link href="/help" className="text-foreground hover:text-primary">
							Help
						</Link>
						<Link href="/admin" className="text-foreground hover:text-primary">
							Admin
						</Link>
					</nav>

					{/* Mobile Menu Button */}
					<button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
						<Menu className="h-6 w-6" />
					</button>

					{/* User Menu */}
					{isAuthenticated ? (
						<div className="relative">
							<button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2">
								<Avatar>
									<AvatarImage src={user?.profileImage} />
									<AvatarFallback>
										{user?.firstName?.[0]}
										{user?.lastName?.[0]}
									</AvatarFallback>
								</Avatar>
								<ChevronDown className="h-4 w-4" />
							</button>

							{isUserMenuOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border">
									<div className="py-1">
										<Link href="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
											Profile
										</Link>
										<Link href="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
											Settings
										</Link>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
										>
											Logout
										</button>
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="hidden md:flex items-center gap-4">
							<Link href="/login">
								<Button variant="outline">Login</Button>
							</Link>
							<Link href="/signup">
								<Button>Sign Up</Button>
							</Link>
						</div>
					)}
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<nav className="md:hidden mt-4 space-y-4">
						<Link
							href="/events"
							className="block text-foreground hover:text-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Events
						</Link>
						<Link
							href="/groups"
							className="block text-foreground hover:text-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Groups
						</Link>
						<Link
							href="/help"
							className="block text-foreground hover:text-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Help
						</Link>
						<Link
							href="/admin"
							className="block text-foreground hover:text-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Admin
						</Link>
						{!isAuthenticated && (
							<div className="flex flex-col gap-2">
								<Link href="/login" onClick={() => setIsMenuOpen(false)}>
									<Button variant="outline" className="w-full">
										Login
									</Button>
								</Link>
								<Link href="/signup" onClick={() => setIsMenuOpen(false)}>
									<Button className="w-full">Sign Up</Button>
								</Link>
							</div>
						)}
					</nav>
				)}
			</div>
		</header>
	);
};

export default Header;
