import React from 'react';
import AdminMenuList from './AdminMenuList';

interface LayoutAdminProps {
	children: React.ReactNode;
}

export const LayoutAdmin = ({ children }: LayoutAdminProps) => {
	return (
		<div className="flex h-screen w-full bg-background">
			<div className="w-64 border-r border-input bg-card">
				<AdminMenuList />
			</div>
			<div className="flex-1 overflow-auto">{children}</div>
		</div>
	);
};
