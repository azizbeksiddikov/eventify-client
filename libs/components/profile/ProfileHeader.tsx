import { useTranslation } from "next-i18next";
import { Calendar, Users, Ticket, Heart, Star, User } from "lucide-react";

import { getMemberTypeColor, NEXT_APP_API_URL } from "@/libs/config";
import { Member } from "@/libs/types/member/member";
import { Avatar, AvatarImage, AvatarFallback } from "@/libs/components/ui/avatar";
import { CurrencyConverter } from "@/libs/components/common/CurrencyConverter";

interface ProfileHeaderProps {
	member: Member;
	groupsCount: number;
	ticketsCount: number;
}

export const ProfileHeader = ({ member, groupsCount, ticketsCount }: ProfileHeaderProps) => {
	const { t } = useTranslation("profile");
	const stats = [
		{
			label: t("points"),
			value: member.memberPoints || 0,
			icon: Star,
		},
		{
			label: t("groups"),
			value: groupsCount || 0,
			icon: Users,
		},
		{
			label: t("events"),
			value: member.memberEvents || 0,
			icon: Calendar,
		},
		{
			label: t("tickets"),
			value: ticketsCount || 0,
			icon: Ticket,
		},
		{
			label: t("likes"),
			value: member.memberLikes || 0,
			icon: Heart,
		},
	];

	return (
		<div className="bg-card rounded-xl shadow-lg p-5 sm:p-8 md:p-10 border">
			<div className="flex flex-col gap-5 sm:gap-8">
				<div className="flex flex-col lg:flex-row gap-5 sm:gap-8 lg:gap-12">
					{/* Profile Section */}
					<div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 flex-1">
						<Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36">
							{member.memberImage ? (
								<AvatarImage
									src={`${NEXT_APP_API_URL}/${member.memberImage}`}
									alt={member.memberFullName ?? t("no_image")}
									className="rounded-full ring-4 ring-primary/10"
								/>
							) : (
								<AvatarFallback className="bg-muted rounded-full">
									<User className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 text-muted-foreground" />
								</AvatarFallback>
							)}
						</Avatar>

						<div className="flex flex-col items-center md:items-start space-y-4  h-full justify-around">
							<div className="flex flex-col items-center md:items-start gap-3 justify-between ">
								<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-card-foreground tracking-tight text-center md:text-left break-words max-w-full">
									{member.memberFullName}
								</h1>
								<div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2">
									<p className="text-muted-foreground text-base md:text-xl font-medium break-all">@{member.username}</p>
									<span
										className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold ${getMemberTypeColor(member.memberType)}`}
									>
										{member.memberType}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Stats Section */}
					<div className="bg-muted/30 rounded-xl backdrop-blur-sm p-3 sm:p-6">
						<div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-2 sm:gap-4">
							{stats.map((stat, index) => (
								<div
									key={index}
									className="flex flex-col items-center justify-center min-w-0 p-2.5 sm:p-4 rounded-lg bg-card/50 text-center"
								>
									<div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-1">
										<stat.icon className="h-5 w-5 text-primary" />
										{stat.label === t("points") ? (
											<CurrencyConverter points={stat.value} showSelector={false} />
										) : (
											<span className="text-xl sm:text-2xl font-bold text-card-foreground">{stat.value}</span>
										)}
									</div>
									<span className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Description Section */}
				{member.memberDesc && (
					<div className="border-t pt-4">
						<p className="text-card-foreground text-base md:text-lg text-left leading-relaxed">
							{member.memberDesc ?? t("no_description")}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
