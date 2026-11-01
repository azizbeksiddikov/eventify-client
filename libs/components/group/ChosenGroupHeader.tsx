import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { useReactiveVar } from "@apollo/client/react";
import { Plus, ArrowLeft } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";

import { userVar } from "@/apollo/store";
import { smallError } from "@/libs/alert";
import { MemberType } from "@/libs/enums/member.enum";

const ChosenGroupHeader = () => {
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
		<section className="bg-gradient-to-b from-muted-foreground/10 to-background py-4 sm:py-8">
			<div className="flex flex-row flex-wrap items-center justify-between sm:mb-6 max-w-7xl mx-auto px-4 sm:px-12 lg:px-20 gap-3">
				<Button
					type="button"
					onClick={() => router.push("/groups")}
					variant="outline"
					className="h-auto min-h-11 fine:min-h-10 whitespace-normal text-left py-2 px-4 border-primary/30 text-primary hover:bg-primary/5 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4" />
						{t("back_to_groups")}
					</div>
				</Button>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							onClick={createGroupHandler}
							aria-disabled={user.memberType !== MemberType.ORGANIZER}
							aria-label={t("create_group")}
							className={`h-11 w-11 fine:h-10 px-0 sm:w-auto sm:px-4 shrink-0 transition-colors duration-200 ${
								user.memberType === MemberType.ORGANIZER
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "bg-muted text-muted-foreground cursor-not-allowed"
							}`}
						>
							<div className="flex items-center gap-2">
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

export default ChosenGroupHeader;
