import { useRef } from "react";
import { useTranslation } from "next-i18next";

import { MemberPanelList } from "@/libs/components/admin/users/MemberList";
import { MemberSearch } from "@/libs/components/admin/users/MemberSearch";
import { Separator } from "@/libs/components/ui/separator";
import PaginationComponent from "@/libs/components/common/PaginationComponent";

import { MembersInquiry } from "@/libs/types/member/member.input";
import { Members } from "@/libs/types/member/member";
import { MemberUpdateInput } from "@/libs/types/member/member.update";

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
	const { t } = useTranslation("admin");
	const membersTotal = members.metaCounter[0]?.total;
	const membersListRef = useRef<HTMLDivElement>(null);

	/** HANDLERS **/
	const pageChangeHandler = (newPage: number) => {
		setMembersInquiry({ ...membersInquiry, page: newPage });
		if (membersListRef.current) {
			const header = document.querySelector("header");
			const headerHeight = header ? header.offsetHeight : 80;
			const extraSpacing = 32; // 32px
			const elementPosition = membersListRef.current.getBoundingClientRect().top + window.pageYOffset;
			const scrollTop = Math.max(0, elementPosition - headerHeight - extraSpacing);
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">{t("member_list")}</h2>
			<div className="bg-card rounded-lg shadow border  ">
				<MemberSearch
					initialInquiry={initialInquiry}
					membersInquiry={membersInquiry}
					setMembersInquiry={setMembersInquiry}
				/>
				<Separator className="bg-border" />
				<div className="p-4 my-4 gap-4 flex flex-col">
					<div ref={membersListRef}>
						<MemberPanelList
							members={members}
							updateMemberHandler={updateMemberHandler}
							removeMemberHandler={removeMemberHandler}
						/>
					</div>
					<PaginationComponent
						totalItems={membersTotal ?? 0}
						currentPage={membersInquiry.page}
						limit={membersInquiry.limit}
						pageChangeHandler={pageChangeHandler}
					/>
				</div>
			</div>
		</div>
	);
};

export default UsersModule;
