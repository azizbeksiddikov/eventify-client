import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Users, Users2, Calendar } from 'lucide-react';
import { cn } from '../../utils';

interface MenuItem {
	title: string;
	icon: React.ReactNode;
	url: string;
}

const AdminMenuList = () => {
	const router = useRouter();
	const [activeMenu, setActiveMenu] = useState('Users');

	/** LIFECYCLES **/
	useEffect(() => {
		const path = router.pathname;
		if (path.includes('/groups')) {
			setActiveMenu('Groups');
		} else if (path.includes('/events')) {
			setActiveMenu('Events');
		} else if (path.includes('/users')) {
			setActiveMenu('Users');
		}
	}, [router.pathname]);

	const menu_set: MenuItem[] = [
		{
			title: 'Users',
			icon: <Users className="h-5 w-5" />,
			url: '/_admin/users',
		},
		{
			title: 'Groups',
			icon: <Users2 className="h-5 w-5" />,
			url: '/_admin/groups',
		},
		{
			title: 'Events',
			icon: <Calendar className="h-5 w-5" />,
			url: '/_admin/events',
		},
	];

	return (
		<div className="space-y-3 p-4">
			{menu_set.map((item, index) => (
				<Link
					key={index}
					href={item.url}
					className={cn(
						'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
						activeMenu === item.title
							? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
							: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
					)}
				>
					<div className="flex h-5 w-5 items-center justify-center">{item.icon}</div>
					<span className="flex-1 font-medium">{item.title}</span>
				</Link>
			))}
		</div>
	);
};

export default AdminMenuList;
