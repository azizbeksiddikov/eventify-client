import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Direction } from '@/libs/enums/common.enum';
import { MemberStatus, MemberType } from '@/libs/enums/member.enum';
import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { GroupCategory } from '@/libs/enums/group.enum';
import { TicketStatus } from '@/libs/enums/ticket.enum';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';

interface AdminSearchBarProps {
	activeTab: string;
	searchText: string;
	sortBy: string;
	sortDirection: Direction;
	memberStatus: string;
	memberType: string;
	eventStatus: string;
	eventCategory: string;
	groupCategory: string;
	ticketStatus: string;
	itemsPerPage: number;
	onSearchChange: (text: string) => void;
	onSortChange: (sortBy: string) => void;
	onDirectionToggle: () => void;
	onStatusChange: (status: string) => void;
	onTypeChange: (type: string) => void;
	onEventStatusChange: (status: string) => void;
	onEventCategoryChange: (category: string) => void;
	onGroupCategoryChange: (category: string) => void;
	onTicketStatusChange: (status: string) => void;
	onItemsPerPageChange: (count: number) => void;
	onClearFilters: () => void;
}

const AdminSearchBar = ({
	activeTab,
	searchText,
	sortBy,
	sortDirection,
	memberStatus,
	memberType,
	eventStatus,
	eventCategory,
	groupCategory,
	ticketStatus,
	itemsPerPage,
	onSearchChange,
	onSortChange,
	onDirectionToggle,
	onStatusChange,
	onTypeChange,
	onEventStatusChange,
	onEventCategoryChange,
	onGroupCategoryChange,
	onTicketStatusChange,
	onItemsPerPageChange,
	onClearFilters,
}: AdminSearchBarProps) => {
	const getSortOptions = () => {
		switch (activeTab) {
			case 'users':
				return [
					{ value: 'createdAt', label: 'Created Date' },
					{ value: 'memberLikes', label: 'Likes' },
					{ value: 'memberFollowings', label: 'Followings' },
					{ value: 'memberFollowers', label: 'Followers' },
				];
			case 'events':
				return [
					{ value: 'createdAt', label: 'Created Date' },
					{ value: 'eventLikes', label: 'Likes' },
					{ value: 'attendeeCount', label: 'Attendees' },
					{ value: 'eventViews', label: 'Views' },
				];
			case 'groups':
				return [
					{ value: 'createdAt', label: 'Created Date' },
					{ value: 'groupLikes', label: 'Likes' },
					{ value: 'memberCount', label: 'Members' },
					{ value: 'groupViews', label: 'Views' },
				];
			case 'tickets':
				return [
					{ value: 'createdAt', label: 'Created Date' },
					{ value: 'updatedAt', label: 'Updated Date' },
				];
			default:
				return [];
		}
	};

	return (
		<div className="space-y-4">
			{/* Search and Sort Row */}
			<div className="flex flex-col md:flex-row gap-4">
				{/* Search Input */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
					<Input
						type="text"
						placeholder={`Search ${activeTab}...`}
						value={searchText}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
					/>
				</div>

				{/* Sort Controls */}
				<div className="flex gap-2">
					<Select value={sortBy} onValueChange={onSortChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent>
							{getSortOptions().map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Button variant="outline" size="icon" onClick={onDirectionToggle} className="shrink-0">
						<ArrowUpDown className="h-4 w-4" />
					</Button>
				</div>

				{/* Items Per Page */}
				<div className="flex items-center gap-2">
					<Input
						type="number"
						min="1"
						max="100"
						value={itemsPerPage || 6}
						onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
						className="w-[120px]"
						placeholder="Items per page"
					/>
					<span className="text-sm text-gray-500">per page</span>
				</div>
			</div>

			{/* Filters Row */}
			<div className="flex flex-wrap gap-2">
				{/* User Filters */}
				{activeTab === 'users' && (
					<>
						<Select value={memberStatus} onValueChange={onStatusChange}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value={MemberStatus.ACTIVE}>Active</SelectItem>
								<SelectItem value={MemberStatus.BLOCKED}>Blocked</SelectItem>
							</SelectContent>
						</Select>

						<Select value={memberType} onValueChange={onTypeChange}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value={MemberType.ADMIN}>Admin</SelectItem>
								<SelectItem value={MemberType.USER}>User</SelectItem>
							</SelectContent>
						</Select>
					</>
				)}

				{/* Event Filters */}
				{activeTab === 'events' && (
					<>
						<Select value={eventStatus} onValueChange={onEventStatusChange}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value={EventStatus.UPCOMING}>Upcoming</SelectItem>
								<SelectItem value={EventStatus.ONGOING}>Ongoing</SelectItem>
								<SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
								<SelectItem value={EventStatus.CANCELLED}>Cancelled</SelectItem>
							</SelectContent>
						</Select>

						<Select value={eventCategory} onValueChange={onEventCategoryChange}>
							<SelectTrigger className="w-[150px]">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value={EventCategory.TECHNOLOGY}>Technology</SelectItem>
								<SelectItem value={EventCategory.FOOD}>Food</SelectItem>
								<SelectItem value={EventCategory.ENTERTAINMENT}>Entertainment</SelectItem>
								<SelectItem value={EventCategory.SPORTS}>Sports</SelectItem>
							</SelectContent>
						</Select>
					</>
				)}

				{/* Group Filters */}
				{activeTab === 'groups' && (
					<Select value={groupCategory} onValueChange={onGroupCategoryChange}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Categories</SelectItem>
							<SelectItem value={GroupCategory.TECHNOLOGY}>Technology</SelectItem>
							<SelectItem value={GroupCategory.FOOD}>Food</SelectItem>
							<SelectItem value={GroupCategory.ENTERTAINMENT}>Entertainment</SelectItem>
							<SelectItem value={GroupCategory.SPORTS}>Sports</SelectItem>
						</SelectContent>
					</Select>
				)}

				{/* Ticket Filters */}
				{activeTab === 'tickets' && (
					<Select value={ticketStatus} onValueChange={onTicketStatusChange}>
						<SelectTrigger className="w-[150px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value={TicketStatus.PURCHASED}>Purchased</SelectItem>
							<SelectItem value={TicketStatus.USED}>Used</SelectItem>
							<SelectItem value={TicketStatus.CANCELLED}>Cancelled</SelectItem>
							<SelectItem value={TicketStatus.EXPIRED}>Expired</SelectItem>
						</SelectContent>
					</Select>
				)}

				{/* Clear Filters Button */}
				<Button variant="outline" size="sm" onClick={onClearFilters} className="ml-auto">
					<Filter className="h-4 w-4 mr-2" />
					Clear Filters
				</Button>
			</div>
		</div>
	);
};

export default AdminSearchBar;
