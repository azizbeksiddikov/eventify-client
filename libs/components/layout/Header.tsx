import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

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
		<header className="sticky  py-5 top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
			<div className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3">
						<Image src="/images/logo.png" alt="Eventify Logo" width={48} height={48} />
						<span className="text-2xl font-bold text-foreground">Eventify</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						<Link href="/" className="text-foreground hover:text-primary transition-colors duration-200 text-body">
							Home
						</Link>
						<Link
							href="/events"
							className="text-foreground hover:text-primary transition-colors duration-200 text-body"
						>
							Events
						</Link>
						<Link
							href="/groups"
							className="text-foreground hover:text-primary transition-colors duration-200 text-body"
						>
							Groups
						</Link>

						<Link
							href="/organizers"
							className="text-foreground hover:text-primary transition-colors duration-200 text-body"
						>
							Organizers
						</Link>
						<Link href="/help" className="text-foreground hover:text-primary transition-colors duration-200 text-body">
							Help
						</Link>
						<Link href="/admin" className="text-foreground hover:text-primary transition-colors duration-200 text-body">
							Admin
						</Link>
					</nav>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2.5 rounded-full hover:bg-muted/80 transition-colors duration-200"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
					</button>

					{/* User Menu */}
					{isAuthenticated ? (
						<div className="relative">
							<button
								onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
								className="flex items-center gap-2.5 p-2.5 rounded-full hover:bg-muted/80 transition-colors duration-200"
							>
								<Avatar className="w-10 h-10">
									<AvatarImage src={user?.profileImage} />
									<AvatarFallback className="bg-primary/90 text-primary-foreground">
										{user?.firstName?.[0]}
										{user?.lastName?.[0]}
									</AvatarFallback>
								</Avatar>
								<ChevronDown className="h-4 w-4 text-muted-foreground" />
							</button>

							{isUserMenuOpen && (
								<div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-background/95 backdrop-blur-sm border border-border/50">
									<div className="py-2">
										<Link
											href="/profile"
											className="block px-4 py-2.5 text-body text-foreground hover:bg-muted/80 transition-colors duration-200"
										>
											Profile
										</Link>
										<Link
											href="/settings"
											className="block px-4 py-2.5 text-body text-foreground hover:bg-muted/80 transition-colors duration-200"
										>
											Settings
										</Link>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2.5 text-body text-foreground hover:bg-muted/80 transition-colors duration-200"
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
								<Button variant="outline" className="text-foreground h-11 px-6">
									Login
								</Button>
							</Link>
							<Link href="/signup">
								<Button className="bg-primary/90 text-primary-foreground hover:bg-primary h-11 px-6">Sign Up</Button>
							</Link>
						</div>
					)}
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<nav className="md:hidden mt-6 space-y-2">
						<Link
							href="/events"
							className="block px-4 py-3 text-body text-foreground hover:bg-muted/80 rounded-lg transition-colors duration-200"
							onClick={() => setIsMenuOpen(false)}
						>
							Events
						</Link>
						<Link
							href="/groups"
							className="block px-4 py-3 text-body text-foreground hover:bg-muted/80 rounded-lg transition-colors duration-200"
							onClick={() => setIsMenuOpen(false)}
						>
							Groups
						</Link>
						<Link
							href="/help"
							className="block px-4 py-3 text-body text-foreground hover:bg-muted/80 rounded-lg transition-colors duration-200"
							onClick={() => setIsMenuOpen(false)}
						>
							Help
						</Link>
						<Link
							href="/admin"
							className="block px-4 py-3 text-body text-foreground hover:bg-muted/80 rounded-lg transition-colors duration-200"
							onClick={() => setIsMenuOpen(false)}
						>
							Admin
						</Link>
						{!isAuthenticated && (
							<div className="flex flex-col gap-3 mt-6">
								<Link href="/login" onClick={() => setIsMenuOpen(false)}>
									<Button variant="outline" className="w-full h-11 text-foreground">
										Login
									</Button>
								</Link>
								<Link href="/signup" onClick={() => setIsMenuOpen(false)}>
									<Button className="w-full h-11 bg-primary/90 text-primary-foreground hover:bg-primary">
										Sign Up
									</Button>
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
