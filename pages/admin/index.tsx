import { useState } from 'react';
import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Direction } from '@/libs/enums/common.enum';
import AdminNavbar from '@/libs/components/admin/AdminNavbar';
import AdminSearchBar from '@/libs/components/admin/AdminSearchBar';
import AdminContent from '@/libs/components/admin/AdminContent';

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState('users');
	const [searchText, setSearchText] = useState('');
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortDirection, setSortDirection] = useState<Direction>(Direction.DESC);

	// User filters
	const [memberStatus, setMemberStatus] = useState('');
	const [memberType, setMemberType] = useState('');

	// Event filters
	const [eventStatus, setEventStatus] = useState('');
	const [eventCategory, setEventCategory] = useState('');

	// Group filters
	const [groupCategory, setGroupCategory] = useState('');

	// Ticket filters
	const [ticketStatus, setTicketStatus] = useState('');

	const [currentPage, setCurrentPage] = useState(1);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleStatusChange = (userId: string, newStatus: string) => {
		// In a real app, this would call an API to update the user's status
		console.log(`Updating user ${userId} status to ${newStatus}`);
	};

	const handleClearFilters = () => {
		setSearchText('');
		setSortBy('createdAt');
		setSortDirection(Direction.DESC);
		setMemberStatus('');
		setMemberType('');
		setEventStatus('');
		setEventCategory('');
		setGroupCategory('');
		setTicketStatus('');
		setCurrentPage(1);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Sidebar Navigation */}
					<AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />

					{/* Main Content */}
					<div className="flex-1">
						{/* Search and Filters */}
						<AdminSearchBar
							activeTab={activeTab}
							searchText={searchText}
							sortBy={sortBy}
							sortDirection={sortDirection}
							memberStatus={memberStatus}
							memberType={memberType}
							eventStatus={eventStatus}
							eventCategory={eventCategory}
							groupCategory={groupCategory}
							ticketStatus={ticketStatus}
							onSearchChange={setSearchText}
							onSortChange={setSortBy}
							onDirectionToggle={() =>
								setSortDirection(sortDirection === Direction.ASC ? Direction.DESC : Direction.ASC)
							}
							onStatusChange={setMemberStatus}
							onTypeChange={setMemberType}
							onEventStatusChange={setEventStatus}
							onEventCategoryChange={setEventCategory}
							onGroupCategoryChange={setGroupCategory}
							onTicketStatusChange={setTicketStatus}
							onClearFilters={handleClearFilters}
						/>

						{/* Content and Pagination */}
						<AdminContent
							activeTab={activeTab}
							currentPage={currentPage}
							searchText={searchText}
							sortBy={sortBy}
							sortDirection={sortDirection}
							memberStatus={memberStatus}
							memberType={memberType}
							eventStatus={eventStatus}
							eventCategory={eventCategory}
							groupCategory={groupCategory}
							ticketStatus={ticketStatus}
							onPageChange={handlePageChange}
							onStatusChange={handleStatusChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withBasicLayout(AdminPage);
