import React from "react";
import { useTranslation } from "next-i18next";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/libs/components/ui/table";
import GroupRow from "@/libs/components/admin/groups/GroupRow";

import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { Groups } from "@/libs/types/group/group";
import { Group } from "@/libs/types/group/group";

interface GroupPanelListType {
	groups: Groups;
	updateGroupHandler: (group: GroupUpdateInput) => Promise<void>;
	removeGroupHandler: (groupId: string) => Promise<void>;
}

export const GroupPanelList = ({ groups, updateGroupHandler, removeGroupHandler }: GroupPanelListType) => {
	const { t } = useTranslation("admin");

	return (
		<div className="rounded-md border border-input bg-card p-4">
			<Table>
				<TableHeader>
					<TableRow className="bg-card hover:bg-accent/50">
						<TableHead className="w-[10%] text-muted-foreground">{t("id")}</TableHead>
						<TableHead className="w-[20%] text-muted-foreground">{t("group")}</TableHead>
						<TableHead className="w-[30%] text-muted-foreground">{t("description")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("members")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("events")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("views_header")}</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">{t("actions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{groups.metaCounter[0]?.total === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center">
								<span className="text-muted-foreground">{t("no_data_found")}</span>
							</TableCell>
						</TableRow>
					) : (
						groups.list?.map((group: Group) => {
							return (
								<GroupRow
									key={group._id}
									group={group}
									updateGroupHandler={updateGroupHandler}
									removeGroupHandler={removeGroupHandler}
								/>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
