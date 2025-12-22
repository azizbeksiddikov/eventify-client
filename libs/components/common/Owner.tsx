import { useTranslation } from "next-i18next";
import Link from "next/link";

import { Crown, Users, User } from "lucide-react";
import { Badge } from "@/libs/components/ui/badge";
import { Card } from "@/libs/components/ui/card";

import { NEXT_APP_API_URL } from "@/libs/config";
import { Member } from "@/libs/types/member/member";
import { Avatar, AvatarImage, AvatarFallback } from "@/libs/components/ui/avatar";

interface OwnerProps {
	member: Member;
	title?: string;
}

const Owner = ({ member, title = "Group Owner" }: OwnerProps) => {
	const { t } = useTranslation("organizers");

	return (
		<Card className="p-4 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border  /50">
			<h2 className="text-lg font-semibold mb-3 text-card-foreground flex items-center gap-2">
				<Users className="w-4 h-4 text-card-foreground" />
				{title}
			</h2>
			<Link
				href={`/organizers/${member._id}`}
				className="block group hover:scale-105 transition-transform duration-300"
			>
				<div className="flex flex-row items-start gap-8">
					<div className="flex items-center">
						<Avatar className="h-16 w-16">
							{member?.memberImage ? (
								<AvatarImage
									src={`${NEXT_APP_API_URL}/${member.memberImage}`}
									alt={member.memberFullName ?? t("owner_avatar")}
									className="rounded-full"
								/>
							) : (
								<AvatarFallback className="bg-muted rounded-full">
									<User className="h-10 w-10 text-muted-foreground" />
								</AvatarFallback>
							)}
						</Avatar>
					</div>
					<div className="flex flex-col gap-2">
						<h3 className="font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
							{member.memberFullName ?? t("no_name")}
						</h3>
						<Badge className="bg-yellow-100 text-yellow-800 py-0.5">
							<Crown className="h-2.5 w-2.5 mr-1" />
							{t("owner")}
						</Badge>
						<p className="text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200 line-clamp-2">
							{member.memberDesc ?? t("no_description")}
						</p>
					</div>
				</div>
			</Link>
		</Card>
	);
};

export default Owner;
