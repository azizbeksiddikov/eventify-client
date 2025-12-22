import { useTranslation } from "next-i18next";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";
import MemberRow from "@/libs/components/admin/users/MemberRow";

import { Members } from "@/libs/types/member/member";
import { MemberUpdateInput } from "@/libs/types/member/member.update";
import { Message } from "@/libs/enums/common.enum";

interface MemberPanelListType {
	members: Members;
	updateMemberHandler: (member: MemberUpdateInput) => Promise<void>;
	removeMemberHandler: (memberId: string) => Promise<void>;
}

export const MemberPanelList = ({ members, updateMemberHandler, removeMemberHandler }: MemberPanelListType) => {
	const { t } = useTranslation("admin");

	return (
		<div className="rounded-md border border-input bg-card p-4">
			<Table>
				<TableHeader>
					<TableRow className="bg-card hover:bg-accent/50">
						<TableHead className="w-[10%] text-muted-foreground">{t("id")}</TableHead>
						<TableHead className="w-[20%] text-muted-foreground">{t("username")}</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">{t("full_name")}</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">{t("phone_number")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("points_header")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("status")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("type")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("actions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{members.metaCounter[0]?.total === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center">
								<span className="text-muted-foreground">{t("no_data_found")}</span>
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
