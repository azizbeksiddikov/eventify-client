import { Avatar, AvatarImage, AvatarFallback } from "@/libs/components/ui/avatar";
import { Edit, Save, Trash2, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "next-i18next";

import { Badge } from "@/libs/components/ui/badge";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { TableCell, TableRow } from "@/libs/components/ui/table";

import { REACT_APP_API_URL } from "@/libs/config";
import { MemberStatus, MemberType } from "@/libs/enums/member.enum";
import { Member } from "@/libs/types/member/member";
import { MemberUpdateInput } from "@/libs/types/member/member.update";
import { formatPhoneNumber } from "@/libs/utils";

interface MemberRowProps {
	member: Member;
	updateMemberHandler: (member: MemberUpdateInput) => Promise<void>;
	removeMemberHandler: (memberId: string) => Promise<void>;
	initialMember?: MemberUpdateInput;
}

const MemberRow = ({
	member,
	updateMemberHandler,
	removeMemberHandler,
	initialMember = {
		_id: member._id,
		memberFullName: member.memberFullName,
		memberPhone: member.memberPhone,
		memberPoints: member.memberPoints,
		memberStatus: member.memberStatus,
		memberType: member.memberType,
	},
}: MemberRowProps) => {
	const { t } = useTranslation();
	const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>(initialMember);
	const [isEditing, setIsEditing] = useState(false);

	const cancelHandler = () => {
		setMemberUpdateInput(initialMember);
		setIsEditing(false);
	};

	const saveHandler = async () => {
		await updateMemberHandler(memberUpdateInput);
		setIsEditing(false);
	};

	const removeHandler = async () => {
		await removeMemberHandler(member._id);
	};

	const inputHandler = (field: keyof MemberUpdateInput, value: string | number) => {
		setMemberUpdateInput((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const phoneHandler = (value: string) => {
		const formattedNumber = formatPhoneNumber(value);
		setMemberUpdateInput({ ...memberUpdateInput, memberPhone: formattedNumber });
	};

	return (
		<TableRow key={member._id} className="hover:bg-accent/50">
			{/* ID */}
			<TableCell className="font-medium text-foreground">{member._id}</TableCell>

			{/* AVATAR + Nickname */}
			<TableCell>
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8 flex items-center justify-center">
						<AvatarImage
							src={`${REACT_APP_API_URL}/${member?.memberImage}`}
							alt={member.username}
							className="rounded-full"
						/>
						<AvatarFallback className="bg-muted rounded-full">
							<User className="h-6 w-6 text-muted-foreground" />
						</AvatarFallback>
					</Avatar>
					{member.memberType === MemberType.ORGANIZER ? (
						<Link
							href={`/organizer/detail?organizerId=${member._id}`}
							className="font-medium text-foreground underline hover:text-primary hover:underline"
						>
							{member.username}
						</Link>
					) : (
						<span className="font-medium text-foreground">{member.username}</span>
					)}
				</div>
			</TableCell>

			{/* FULL NAME */}
			<TableCell>
				{isEditing ? (
					<Input
						value={memberUpdateInput.memberFullName ?? ""}
						onChange={(e) => inputHandler("memberFullName", e.target.value)}
						className="h-8"
					/>
				) : (
					<span className="text-foreground">{member.memberFullName || t("N/A")}</span>
				)}
			</TableCell>

			{/* PHONE NUMBER */}
			<TableCell>
				{isEditing ? (
					<Input
						value={memberUpdateInput.memberPhone ?? ""}
						onChange={(e) => phoneHandler(e.target.value)}
						className="h-8"
					/>
				) : (
					<span className="text-foreground">{member.memberPhone || t("N/A")}</span>
				)}
			</TableCell>

			{/* MEMBER POINTS */}
			<TableCell>
				{isEditing ? (
					<Input
						type="number"
						value={memberUpdateInput.memberPoints ?? 0}
						onChange={(e) => inputHandler("memberPoints", parseInt(e.target.value))}
						className="h-8"
					/>
				) : (
					<span className="text-foreground">{member.memberPoints ?? 0}</span>
				)}
			</TableCell>

			{/* MEMBER STATUS */}
			<TableCell>
				{isEditing ? (
					<Select value={memberUpdateInput.memberStatus} onValueChange={(value) => inputHandler("memberStatus", value)}>
						<SelectTrigger className="h-8">
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={MemberStatus.ACTIVE}>{t("ACTIVE")}</SelectItem>
							<SelectItem value={MemberStatus.BLOCKED}>{t("BLOCKED")}</SelectItem>
						</SelectContent>
					</Select>
				) : (
					<Badge className="w-full justify-center bg-card text-foreground border-input">{member.memberStatus}</Badge>
				)}
			</TableCell>

			{/* MEMBER TYPE */}
			<TableCell>
				{isEditing ? (
					<Select value={memberUpdateInput.memberType} onValueChange={(value) => inputHandler("memberType", value)}>
						<SelectTrigger className="h-8">
							<SelectValue placeholder="Select type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={MemberType.ORGANIZER}>{t("ORGANIZER")}</SelectItem>
							<SelectItem value={MemberType.USER}>{t("USER")}</SelectItem>
						</SelectContent>
					</Select>
				) : (
					<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
						{member.memberType}
					</Badge>
				)}
			</TableCell>

			{/* ACTIONS */}
			<TableCell>
				<div className="flex gap-2">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								size="icon"
								onClick={() => saveHandler()}
								className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
							>
								<Save className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => cancelHandler()}
								className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive"
							>
								<X className="h-4 w-4" />
							</Button>
						</>
					) : (
						<>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setIsEditing(true)}
								className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => removeHandler()}
								className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
};

export default MemberRow;
