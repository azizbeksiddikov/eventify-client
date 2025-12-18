import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";
import { useReactiveVar } from "@apollo/client/react";
import { userVar } from "@/apollo/store";

import { Button } from "@/libs/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";
import { ArrowLeft, CalendarPlus } from "lucide-react";

import { smallError } from "@/libs/alert";
import { MemberType } from "@/libs/enums/member.enum";

const ChosenEventHeader = () => {
	const router = useRouter();
	const { t } = useTranslation("common");
	const user = useReactiveVar(userVar);

	const createHandler = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t("Only organizers can create events"));
			return;
		}
		router.push("/event/create");
	};

	return (
		<section className="bg-gradient-to-b from-muted-foreground/10 to-background py-8">
			<div className="flex flex-col md:flex-row items-center justify-between mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-3">
				<Button
					type="button"
					onClick={() => router.push("/events")}
					variant="outline"
					className="h-10 px-4 w-full md:w-auto border-primary/30 text-primary hover:bg-primary/5 transition-colors duration-200"
				>
					<div className="flex items-center gap-2">
						<ArrowLeft className="w-4 h-4" />
						{t("Back to Events")}
					</div>
				</Button>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							onClick={createHandler}
							aria-disabled={user.memberType !== MemberType.ORGANIZER}
							className={`h-10 px-4 w-full md:w-auto transition-colors duration-200 ${
								user.memberType === MemberType.ORGANIZER
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "bg-muted text-muted-foreground cursor-not-allowed"
							}`}
						>
							<div className="flex items-center gap-2">
								{t("Create Event")}
								<CalendarPlus className="w-4 h-4" />
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

export default ChosenEventHeader;
