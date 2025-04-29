import { Users, Calendar, Users2, Ticket, MessageSquare } from 'lucide-react';

interface AdminNavbarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const AdminNavbar = ({ activeTab, onTabChange }: AdminNavbarProps) => {
	const tabs = [
		{ id: 'users', label: 'Users', icon: Users },
		{ id: 'events', label: 'Events', icon: Calendar },
		{ id: 'groups', label: 'Groups', icon: Users2 },
		{ id: 'tickets', label: 'Tickets', icon: Ticket },
		{ id: 'qa', label: 'Q&A', icon: MessageSquare },
	];

	return (
		<div className="w-64 bg-white shadow-sm p-4">
			<nav className="space-y-1">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					return (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={`
                w-full flex items-center space-x-3 px-4 py-2 rounded-xl
                transition-all duration-200
                ${activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
						>
							<Icon className="h-5 w-5" />
							<span className="text-sm font-medium">{tab.label}</span>
						</button>
					);
				})}
			</nav>
		</div>
	);
};

export default AdminNavbar;
