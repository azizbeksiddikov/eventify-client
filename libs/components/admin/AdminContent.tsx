import { fakeMembers, fakeGroups, fakeEvents, fakeTickets } from '@/pages/admin/data';
import AdminUserCard from './AdminUserCard';
import AdminEventCard from './AdminEventCard';
import AdminGroupCard from './AdminGroupCard';
import AdminTicketCard from './AdminTicketCard';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Member } from '@/libs/types/member/member';
import { Event } from '@/libs/types/event/event';
import { Group } from '@/libs/types/group/group';
import { Ticket } from '@/libs/types/ticket/ticket';
import { Direction } from '@/libs/enums/common.enum';
import { EventCategory } from '@/libs/enums/event.enum';
import { GroupCategory } from '@/libs/enums/group.enum';

interface AdminContentProps {
	activeTab: string;
	currentPage: number;
	searchText: string;
	sortBy: string;
	sortDirection: Direction;
	memberStatus: string;
	memberType: string;
	eventStatus: string;
	eventCategory: string;
	groupCategory: string;
	ticketStatus: string;
	onPageChange: (page: number) => void;
	onStatusChange: (userId: string, newStatus: string) => void;
}

const AdminContent = ({
	activeTab,
	currentPage,
	searchText,
	sortBy,
	sortDirection,
	memberStatus,
	memberType,
	eventStatus,
	eventCategory,
	groupCategory,
	ticketStatus,
	onPageChange,
	onStatusChange,
}: AdminContentProps) => {
	const itemsPerPage = 6;

	// Get filtered data based on current tab
	const getFilteredData = () => {
		switch (activeTab) {
			case 'users':
				return fakeMembers.list;
			case 'events':
				return fakeEvents.list;
			case 'groups':
				return fakeGroups.list;
			case 'tickets':
				return fakeTickets.list;
			default:
				return fakeMembers.list;
		}
	};

	// Filter and sort data
	const filterAndSortData = () => {
		const filteredData = getFilteredData();

		const filterAndSort = <T extends Member | Event | Group | Ticket>(
			data: T[],
			filterFn: (item: T) => boolean,
			sortFn: (a: T, b: T) => number,
		) => {
			return data.filter(filterFn).sort(sortFn);
		};

		switch (activeTab) {
			case 'users':
				return filterAndSort<Member>(
					filteredData as Member[],
					(user) => {
						const matchesSearch = user.username.toLowerCase().includes(searchText.toLowerCase());
						const matchesStatus = !memberStatus || user.memberStatus === memberStatus;
						const matchesType = !memberType || user.memberType === memberType;
						return matchesSearch && matchesStatus && matchesType;
					},
					(a, b) => {
						const direction = sortDirection === Direction.ASC ? 1 : -1;
						switch (sortBy) {
							case 'memberLikes':
								return (a.memberLikes - b.memberLikes) * direction;
							case 'memberFollowings':
								return (a.memberFollowings - b.memberFollowings) * direction;
							case 'memberFollowers':
								return (a.memberFollowers - b.memberFollowers) * direction;
							case 'createdAt':
								return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
							default:
								return 0;
						}
					},
				);

			case 'events':
				return filterAndSort<Event>(
					filteredData as Event[],
					(event) => {
						const matchesSearch = event.eventName.toLowerCase().includes(searchText.toLowerCase());
						const matchesStatus = !eventStatus || event.eventStatus === eventStatus;
						const matchesCategory = !eventCategory || event.eventCategories.includes(eventCategory as EventCategory);
						return matchesSearch && matchesStatus && matchesCategory;
					},
					(a, b) => {
						const direction = sortDirection === Direction.ASC ? 1 : -1;
						switch (sortBy) {
							case 'eventLikes':
								return (a.eventLikes - b.eventLikes) * direction;
							case 'attendeeCount':
								return (a.attendeeCount - b.attendeeCount) * direction;
							case 'eventViews':
								return (a.eventViews - b.eventViews) * direction;
							case 'createdAt':
								return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
							default:
								return 0;
						}
					},
				);

			case 'groups':
				return filterAndSort<Group>(
					filteredData as Group[],
					(group) => {
						const matchesSearch = group.groupName.toLowerCase().includes(searchText.toLowerCase());
						const matchesCategory = !groupCategory || group.groupCategories.includes(groupCategory as GroupCategory);
						return matchesSearch && matchesCategory;
					},
					(a, b) => {
						const direction = sortDirection === Direction.ASC ? 1 : -1;
						switch (sortBy) {
							case 'groupLikes':
								return (a.groupLikes - b.groupLikes) * direction;
							case 'memberCount':
								return (a.memberCount - b.memberCount) * direction;
							case 'groupViews':
								return (a.groupViews - b.groupViews) * direction;
							case 'createdAt':
								return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
							default:
								return 0;
						}
					},
				);

			case 'tickets':
				return filterAndSort<Ticket>(
					filteredData as Ticket[],
					(ticket) => {
						const matchesSearch = ticket._id.toLowerCase().includes(searchText.toLowerCase());
						const matchesStatus = !ticketStatus || ticket.ticketStatus === ticketStatus;
						return matchesSearch && matchesStatus;
					},
					(a, b) => {
						const direction = sortDirection === Direction.ASC ? 1 : -1;
						switch (sortBy) {
							case 'createdAt':
								return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
							case 'updatedAt':
								return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * direction;
							default:
								return 0;
						}
					},
				);

			default:
				return filteredData;
		}
	};

	const filteredData = filterAndSortData();
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

	const renderCard = (item: Member | Event | Group | Ticket) => {
		switch (activeTab) {
			case 'users':
				return <AdminUserCard key={(item as Member)._id} member={item as Member} onDelete={onStatusChange} />;
			case 'events':
				return <AdminEventCard key={(item as Event)._id} event={item as Event} onDelete={onStatusChange} />;
			case 'groups':
				return <AdminGroupCard key={(item as Group)._id} group={item as Group} onDelete={onStatusChange} />;
			case 'tickets':
				return <AdminTicketCard key={(item as Ticket)._id} ticket={item as Ticket} onDelete={onStatusChange} />;
			default:
				return null;
		}
	};

	return (
		<div className="flex-1">
			{/* Content Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{paginatedData.map(renderCard)}</div>

			{/* Pagination */}
			<div className="mt-8">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => onPageChange(currentPage - 1)}
								className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<PaginationItem key={page}>
								<PaginationLink onClick={() => onPageChange(page)} isActive={currentPage === page}>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() => onPageChange(currentPage + 1)}
								className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
};

export default AdminContent;
