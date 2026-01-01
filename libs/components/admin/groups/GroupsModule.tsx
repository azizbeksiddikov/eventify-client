import React, { useRef } from "react";
import { useTranslation } from "next-i18next";

import { GroupPanelList } from "@/libs/components/admin/groups/GroupList";
import { GroupSearch } from "@/libs/components/admin/groups/GroupSearch";
import { Separator } from "@/libs/components/ui/separator";
import PaginationComponent from "@/libs/components/common/PaginationComponent";

import { Groups } from "@/libs/types/group/group";
import { GroupsInquiry } from "@/libs/types/group/group.input";
import { GroupUpdateInput } from "@/libs/types/group/group.update";

interface GroupsInquiryProps {
	groups: Groups;
	initialInquiry: GroupsInquiry;
	groupsInquiry: GroupsInquiry;
	setGroupsInquiry: (groupsInquiry: GroupsInquiry) => void;
	updateGroupHandler: (group: GroupUpdateInput) => Promise<void>;
	removeGroupHandler: (groupId: string) => Promise<void>;
}

const GroupsModule = ({
	groups,
	groupsInquiry,
	setGroupsInquiry,
	initialInquiry,
	updateGroupHandler,
	removeGroupHandler,
}: GroupsInquiryProps) => {
	const { t } = useTranslation("admin");
	const groupsTotal = groups.metaCounter[0]?.total ?? 0;
	const groupsListRef = useRef<HTMLDivElement>(null);

	/** HANDLERS **/

	const pageChangeHandler = (newPage: number) => {
		setGroupsInquiry({ ...groupsInquiry, page: newPage });
		if (groupsListRef.current) {
			const header = document.querySelector("header");
			const headerHeight = header ? header.offsetHeight : 80;
			const extraSpacing = 32; // 32px
			const elementPosition = groupsListRef.current.getBoundingClientRect().top + window.pageYOffset;
			const scrollTop = Math.max(0, elementPosition - headerHeight - extraSpacing);
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">{t("group_list")}</h2>
			<div className="bg-card rounded-lg shadow border  ">
				<GroupSearch
					initialInquiry={initialInquiry}
					groupsInquiry={groupsInquiry}
					setGroupsInquiry={setGroupsInquiry}
				/>
				<Separator className="bg-border" />
				<div className="p-4 my-4 gap-4 flex flex-col">
					<div ref={groupsListRef}>
						<GroupPanelList
							groups={groups}
							updateGroupHandler={updateGroupHandler}
							removeGroupHandler={removeGroupHandler}
						/>
					</div>
					<PaginationComponent
						totalItems={groupsTotal ?? 0}
						currentPage={groupsInquiry.page}
						limit={groupsInquiry.limit}
						pageChangeHandler={pageChangeHandler}
					/>
				</div>
			</div>
		</div>
	);
};

export default GroupsModule;
