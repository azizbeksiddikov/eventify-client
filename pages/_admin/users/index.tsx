import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '@/libs/components/layout/LayoutAdmin';
import { MemberPanelList } from '@/libs/components/admin/users/MemberList';
import { MemberSearch } from '@/libs/components/admin/users/MemberSearch';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { Member } from '../../../libs/types/member/member';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { sweetErrorHandling } from '../../../libs/sweetAlert';
import { organizers } from '@/data';
import { Button } from '@/libs/components/ui/button';
import { Separator } from '@/libs/components/ui/separator';
import { Direction } from '@/libs/enums/common.enum';

interface AdminUsersProps {
	initialInquiry?: MembersInquiry;
}

const defaultInquiry: MembersInquiry = {
	page: 1,
	limit: 10,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		text: '',
	},
};

const AdminUsers: NextPage<AdminUsersProps> = ({ initialInquiry = defaultInquiry }) => {
	const members: Member[] = organizers;
	const membersTotal = members.length;

	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialInquiry);

	/** HANDLERS **/
	const changePageHandler = async (_event: unknown, newPage: number) => {
		membersInquiry.page = newPage + 1;
		setMembersInquiry({ ...membersInquiry });
	};

	const updateMemberHandler = async (data: { _id: string; memberType?: MemberType; memberStatus?: MemberStatus }) => {
		try {
		} catch (error) {
			sweetErrorHandling(error).then();
		}
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">Member List</h2>
			<div className="bg-card rounded-lg shadow border border-border">
				<MemberSearch membersInquiry={membersInquiry} setMembersInquiry={setMembersInquiry} />
				<Separator className="bg-border" />
				<div className="p-6">
					<MemberPanelList members={members} updateMemberHandler={updateMemberHandler} />
					<div className="mt-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground">
							Showing {membersInquiry.limit} of {membersTotal} results
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => changePageHandler(null, membersInquiry.page - 2)}
								disabled={membersInquiry.page === 1}
								className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground"
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => changePageHandler(null, membersInquiry.page)}
								disabled={membersInquiry.page * membersInquiry.limit >= membersTotal}
								className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground"
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withAdminLayout(AdminUsers);
