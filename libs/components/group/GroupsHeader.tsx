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
	const { t } = useTranslation("common");
	const user = useReactiveVar(userVar);

	const createGroupHandler = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t("Only organizers can create groups"));
			return;
		}
		router.push("/groups/create");
	};

	return (
		<section className="bg-gradient-to-b from-muted-foreground/10 to-background py-8">
			<div className="flex flex-col md:flex-row items-center justify-between mb-8 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
				<div className="text-center md:text-left mb-4 md:mb-0">
					<h2>{t("Discover Groups")}</h2>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">
						{t("Find and join amazing groups in your area")}
					</p>
				</div>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							onClick={createGroupHandler}
							aria-disabled={user.memberType !== MemberType.ORGANIZER}
							className={`w-full md:w-auto h-14 px-6 md:px-8 transition-colors duration-200 ${
								user.memberType === MemberType.ORGANIZER
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "bg-muted text-muted-foreground cursor-not-allowed"
							}`}
						>
							<div className="flex items-center justify-center gap-2">
								{t("Create Group")}
								<Plus className="w-4 h-4" />
							</div>
						</Button>
					</TooltipTrigger>
					{user.memberType !== MemberType.ORGANIZER && (
						<TooltipContent side="bottom">{t("Organizers only!")}</TooltipContent>
					)}
				</Tooltip>
			</div>
		</section>
	);
};

export default GroupsHeader;
