import { Avatar, AvatarImage, AvatarFallback } from "@/libs/components/ui/avatar";
import { Edit, Group as GroupIcon, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "next-i18next";

import { Badge } from "@/libs/components/ui/badge";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { TableCell, TableRow } from "@/libs/components/ui/table";

import { NEXT_APP_API_URL } from "@/libs/config";
import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { Group } from "@/libs/types/group/group";

interface GroupRowProps {
	group: Group;
	updateGroupHandler: (group: GroupUpdateInput) => Promise<void>;
	removeGroupHandler: (groupId: string) => Promise<void>;
	initialGroup?: GroupUpdateInput;
}

const GroupRow = ({
	group,
	updateGroupHandler,
	removeGroupHandler,
	initialGroup = {
		_id: group._id,
		groupName: group.groupName,
		groupDesc: group.groupDesc,
		groupImage: group.groupImage,
		groupCategories: group.groupCategories,
	},
}: GroupRowProps) => {
	const { t } = useTranslation();
	const [groupUpdateInput, setGroupUpdateInput] = useState<GroupUpdateInput>(initialGroup);
	const [isEditing, setIsEditing] = useState(false);

	const cancelHandler = () => {
		setGroupUpdateInput(initialGroup);
		setIsEditing(false);
	};

	const saveHandler = async () => {
		await updateGroupHandler(groupUpdateInput);
		setIsEditing(false);
	};

	const removeHandler = async () => {
		await removeGroupHandler(group._id);
	};

	const inputHandler = (field: keyof GroupUpdateInput, value: string | number) => {
		setGroupUpdateInput((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<TableRow key={group._id} className="hover:bg-accent/50">
			{/* ID */}
			<TableCell className="font-medium text-foreground">{group._id}</TableCell>

			{/* AVATAR + GROUP NAME */}
			<TableCell>
				<Link href={`/group/detail?groupId=${group._id}`}>
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8 border border-input flex items-center justify-center ">
							<AvatarImage src={`${NEXT_APP_API_URL}/${group.groupImage}`} alt={group.groupName} />
							<AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center">
								<GroupIcon className="h-4 w-4" />
							</AvatarFallback>
						</Avatar>
						{isEditing ? (
							<Input
								value={groupUpdateInput.groupName ?? group.groupName ?? ""}
								onChange={(e) => inputHandler("groupName", e.target.value)}
								className="w-full bg-background text-foreground border-input focus:ring-primary"
							/>
						) : (
							<Link
								href={`/group/detail?groupId=${group._id}`}
								className="font-medium text-foreground underline hover:text-primary hover:underline"
							>
								{group.groupName}
							</Link>
						)}
					</div>
				</Link>
			</TableCell>

			{/* GROUP DESCRIPTION */}
			<TableCell>
				{isEditing ? (
					<Input
						value={groupUpdateInput.groupDesc ?? group.groupDesc ?? ""}
						onChange={(e) => inputHandler("groupDesc", e.target.value)}
						className="w-full bg-background text-foreground border-input focus:ring-primary"
					/>
				) : (
					<span className="text-foreground">
						{group.groupDesc
							? group.groupDesc.length > 35
								? `${group.groupDesc.slice(0, 35)}...`
								: group.groupDesc
							: t("N/A")}
					</span>
				)}
			</TableCell>

			{/* MEMBERS */}
			<TableCell>
				<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
					{group.memberCount > 0 ? group.memberCount : 0}
				</Badge>
			</TableCell>

			{/* EVENTS */}
			<TableCell>
				<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
					{group.eventsCount > 0 ? group.eventsCount : 0}
				</Badge>
			</TableCell>

			{/* VIEWS */}
			<TableCell>
				<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
					{group.groupViews > 0 ? group.groupViews : 0}
				</Badge>
			</TableCell>

			{/* ACTIONS */}
			<TableCell>
				<div className="flex gap-2">
					{isEditing ? (
						<>
							<Button
								variant="outline"
								size="icon"
								onClick={saveHandler}
								className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
							>
								<Save className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={cancelHandler}
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
								onClick={removeHandler}
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

export default GroupRow;
