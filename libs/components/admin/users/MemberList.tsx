import { useTranslation } from 'next-i18next';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/components/ui/table';
import MemberRow from '@/libs/components/admin/users/MemberRow';

import { Members } from '@/libs/types/member/member';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { Message } from '@/libs/enums/common.enum';

interface MemberPanelListType {
	members: Members;
	updateMemberHandler: (member: MemberUpdateInput) => Promise<void>;
	removeMemberHandler: (memberId: string) => Promise<void>;
}

export const MemberPanelList = ({ members, updateMemberHandler, removeMemberHandler }: MemberPanelListType) => {
	const { t } = useTranslation();

	return (
		<div className="rounded-md border border-input bg-card p-4">
			<Table>
				<TableHeader>
					<TableRow className="bg-card hover:bg-accent/50">
						<TableHead className="w-[10%] text-muted-foreground">{t('ID')}</TableHead>
						<TableHead className="w-[20%] text-muted-foreground">{t('USERNAME')}</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">{t('FULL NAME')}</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">{t('PHONE NUMBER')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('POINTS')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('STATUS')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('TYPE')}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t('ACTIONS')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{members.metaCounter[0]?.total === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center">
								<span className="text-muted-foreground">{t(Message.NO_DATA_FOUND)}</span>
							</TableCell>
						</TableRow>
					) : (
						members.list?.map((member) => {
							return (
								<MemberRow
									key={member._id}
									member={member}
									updateMemberHandler={updateMemberHandler}
									removeMemberHandler={removeMemberHandler}
								/>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
