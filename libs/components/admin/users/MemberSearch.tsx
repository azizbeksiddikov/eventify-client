import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { MemberStatus, MemberType } from '@/libs/enums/member.enum';
import { MembersInquiry } from '@/libs/types/member/member.input';

interface MemberSearchProps {
	membersInquiry: MembersInquiry;
	setMembersInquiry: (inquiry: MembersInquiry) => void;
}

export function MemberSearch({ membersInquiry, setMembersInquiry }: MemberSearchProps) {
	const searchTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				text: e.target.value,
			},
		});
	};

	const clearSearchHandler = () => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				text: '',
				memberType: undefined,
				memberStatus: undefined,
			},
		});
	};

	const changeTypeHandler = (value: string) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				memberType: value === 'all' ? undefined : (value as MemberType),
			},
		});
	};

	const changeStatusHandler = (value: string) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				memberStatus: value === 'all' ? undefined : (value as MemberStatus),
			},
		});
	};

	const changeDirectionHandler = (value: string) => {
		setMembersInquiry({
			...membersInquiry,
			sort: value,
		});
	};

	return (
		<div className="flex items-center gap-6 p-6 rounded-t-lg bg-card border border-border">
			<Input
				placeholder="Search members..."
				value={membersInquiry?.search?.text ?? ''}
				onChange={searchTextHandler}
				className="w-full bg-background text-foreground border-input focus:ring-primary"
			/>
			<Select value={membersInquiry?.sort} onValueChange={changeDirectionHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="createdAt">Created At</SelectItem>
					<SelectItem value="memberPoints">Points</SelectItem>
					<SelectItem value="memberFullName">Full Name</SelectItem>
				</SelectContent>
			</Select>
			<Select value={membersInquiry?.search?.memberType ?? 'all'} onValueChange={changeTypeHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Filter by type" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="all">All Types</SelectItem>
					<SelectItem value={MemberType.ORGANIZER}>Organizer</SelectItem>
					<SelectItem value={MemberType.USER}>User</SelectItem>
				</SelectContent>
			</Select>
			<Select value={membersInquiry?.search?.memberStatus ?? 'all'} onValueChange={changeStatusHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder="Filter by status" />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="all">All Statuses</SelectItem>
					<SelectItem value={MemberStatus.ACTIVE}>Active</SelectItem>
					<SelectItem value={MemberStatus.BLOCKED}>Blocked</SelectItem>
				</SelectContent>
			</Select>
			<Button
				variant="outline"
				onClick={clearSearchHandler}
				className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
			>
				Clear
			</Button>
		</div>
	);
}
