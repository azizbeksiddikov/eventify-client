import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Button } from '@/libs/components/ui/button';
import { User } from 'lucide-react';
import type { Member } from '@/libs/types/member/member';
import { MemberType, MemberStatus } from '@/libs/enums/member.enum';

const Header = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [user, setUser] = useState<Member>({
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
		setIsAuthenticated(false);
		setUser({
			_id: '',
			username: '',
			memberEmail: '',
			memberFullName: '',
			memberType: MemberType.USER,
			memberStatus: MemberStatus.ACTIVE,
			emailVerified: false,
			memberImage: '',
			memberPoints: 0,
			memberLikes: 0,
			memberFollowings: 0,
			memberFollowers: 0,
			memberViews: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	};

	return (
		<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-3 group">
						<Image
							src="/images/logo.png"
							alt="Eventify Logo"
							width={32}
							height={32}
							className="group-hover:scale-105 transition-transform duration-300"
						/>
						<span className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
							Eventify
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="flex items-center gap-8">
						<Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
							Home
						</Link>
						<Link href="/events" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
							Events
						</Link>
						<Link href="/groups" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
							Groups
						</Link>
						<Link
							href="/organizers"
							className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
						>
							Organizers
						</Link>
						<Link href="/help" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
							Help
						</Link>
						<Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300">
							Admin
						</Link>
					</nav>

					{/* User Menu */}
					{isAuthenticated ? (
						<div className="flex items-center gap-4">
							<Link href="/profile" className="hover:opacity-80 transition-opacity duration-300">
								<Avatar className="h-8 w-8">
									{user?.memberImage && user?.memberImage !== '' ? (
										<AvatarImage src={user.memberImage || '/placeholder.svg'} alt={user.memberFullName} />
									) : (
										<AvatarFallback className="bg-white border border-gray-200 flex items-center justify-center">
											<User
												className="text-gray-800"
												style={{
													width: 16,
													height: 16,
													strokeWidth: 2,
												}}
											/>
										</AvatarFallback>
									)}
								</Avatar>
							</Link>
							<Button
								variant="outline"
								onClick={handleLogout}
								className="text-sm text-gray-900 border-gray-300 hover:bg-gray-50 h-9 px-4"
							>
								Logout
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-4">
							<Link href="/login">
								<Button variant="outline" className="text-sm text-gray-900 border-gray-300 hover:bg-gray-50 h-9 px-4">
									Login
								</Button>
							</Link>
							<Link href="/signup">
								<Button className="text-sm text-white bg-gray-900 hover:bg-gray-800 h-9 px-4">Sign Up</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
