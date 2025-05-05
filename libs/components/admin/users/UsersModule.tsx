import React from 'react';
import { MemberPanelList } from '@/libs/components/admin/users/MemberList';
import { MemberSearch } from '@/libs/components/admin/users/MemberSearch';
import { MembersInquiry } from '../../../types/member/member.input';
import { Members } from '../../../types/member/member';
import { Separator } from '@/libs/components/ui/separator';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { useTranslation } from 'react-i18next';
import PaginationComponent from '../../common/PaginationComponent';

interface UsersModuleProps {
	members: Members;
	initialInquiry: MembersInquiry;
	membersInquiry: MembersInquiry;
	setMembersInquiry: (membersInquiry: MembersInquiry) => void;
	updateMemberHandler: (member: MemberUpdateInput) => Promise<void>;
	removeMemberHandler: (memberId: string) => Promise<void>;
}

const UsersModule = ({
	members,
	initialInquiry,
	membersInquiry,
	setMembersInquiry,
	updateMemberHandler,
	removeMemberHandler,
}: UsersModuleProps) => {
	const { t } = useTranslation();
	const membersTotal = members.metaCounter[0]?.total;

	/** HANDLERS **/
	const changePageHandler = async (newPage: number) => {
		setMembersInquiry({ ...membersInquiry, page: newPage });
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">{t('Member List')}</h2>
			<div className="bg-card rounded-lg shadow border border-border">
				<MemberSearch
					initialInquiry={initialInquiry}
					membersInquiry={membersInquiry}
					setMembersInquiry={setMembersInquiry}
				/>
				<Separator className="bg-border" />
				<div className="p-4 my-4 gap-4 flex flex-col">
					<MemberPanelList
						members={members}
						updateMemberHandler={updateMemberHandler}
						removeMemberHandler={removeMemberHandler}
					/>
					<PaginationComponent
						totalItems={membersTotal ?? 0}
						currentPage={membersInquiry.page}
						limit={membersInquiry.limit}
						setCurrentPage={changePageHandler}
					/>
				</div>
			</div>
		</div>
	);
};

export default UsersModule;
