import { useRouter } from "next/navigation";
import { useReactiveVar } from "@apollo/client/react";
import { useTranslation } from "next-i18next";
import { Plus } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";

import { userVar } from "@/apollo/store";
import { smallError } from "@/libs/alert";
import { MemberType } from "@/libs/enums/member.enum";

const GroupsHeader = () => {
	const router = useRouter();
	const { t } = useTranslation("groups");
	const user = useReactiveVar(userVar);

	const createGroupHandler = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t("only_organizers_can_create_groups"));
			return;
		}
		router.push("/groups/create");
	};

	return (
		<section className="bg-gradient-to-b from-muted-foreground/10 to-background py-5 sm:py-8">
			<div className="flex flex-row items-start sm:items-center justify-between gap-3 sm:mb-8 max-w-7xl mx-auto px-4 sm:px-12 lg:px-20">
				<div className="min-w-0 text-left">
					<h1 className="text-2xl sm:text-3xl">{t("discover_groups")}</h1>
					<p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base md:text-lg">{t("find_and_join_amazing_groups")}</p>
				</div>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							onClick={createGroupHandler}
							aria-disabled={user.memberType !== MemberType.ORGANIZER}
							aria-label={t("create_group")}
							className={`h-11 w-11 px-0 sm:w-auto sm:h-14 sm:px-6 md:px-8 shrink-0 transition-colors duration-200 ${
								user.memberType === MemberType.ORGANIZER
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "bg-muted text-muted-foreground cursor-not-allowed"
							}`}
						>
							<div className="flex items-center justify-center gap-2">
								<span className="hidden sm:inline">{t("create_group")}</span>
								<Plus className="w-4 h-4" />
							</div>
						</Button>
					</TooltipTrigger>
					{user.memberType !== MemberType.ORGANIZER && (
						<TooltipContent side="bottom">{t("organizers_only")}</TooltipContent>
					)}
				</Tooltip>
			</div>
		</section>
	);
};

export default GroupsHeader;
