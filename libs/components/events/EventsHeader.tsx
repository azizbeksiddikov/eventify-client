import { userVar } from "@/apollo/store";
import { useTranslation } from "next-i18next";
import { useReactiveVar } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/libs/components/ui/tooltip";

import { smallError } from "@/libs/alert";
import { MemberType } from "@/libs/enums/member.enum";

const EventsHeader = () => {
	const router = useRouter();
	const { t } = useTranslation("events");
	const user = useReactiveVar(userVar);

	const createEventHandler = () => {
		if (user.memberType !== MemberType.ORGANIZER) {
			smallError(t("only_organizers_can_create_events"));
			return;
		}
		router.push("/events/create");
	};
	return (
		<section className="bg-linear-to-b from-muted-foreground/10 to-background py-8">
			<div className="flex flex-col md:flex-row items-center justify-between mb-8 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
				<div className="text-center md:text-left mb-4 md:mb-0">
					<h2>{t("discover_events")}</h2>
					<p className="text-muted-foreground mt-2 text-base md:text-lg">{t("find_and_join_amazing_events")}</p>
				</div>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							onClick={createEventHandler}
							aria-disabled={user.memberType !== MemberType.ORGANIZER}
							className={`w-full md:w-auto h-14 px-6 md:px-8 transition-colors duration-200 ${
								user.memberType === MemberType.ORGANIZER
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "bg-muted text-muted-foreground cursor-not-allowed"
							}`}
						>
							<div className="flex items-center justify-center gap-2">
								{t("create_event")}
								<CalendarPlus className="w-4 h-4" />
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

export default EventsHeader;
