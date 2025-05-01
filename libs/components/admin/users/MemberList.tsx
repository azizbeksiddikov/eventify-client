import React, { useState } from 'react';
import Link from 'next/link';
import { Member } from '../../../types/member/member';
import { MemberStatus, MemberType } from '../../../enums/member.enum';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/components/ui/table';
import { Button } from '@/libs/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Input } from '@/libs/components/ui/input';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { Badge } from '@/libs/components/ui/badge';

interface MemberPanelListType {
	members: Member[];
	updateMemberHandler: (data: {
		_id: string;
		memberType?: MemberType;
		memberStatus?: MemberStatus;
		memberFullName?: string;
		memberPoints?: number;
		memberImage?: string;
		memberPhone?: string;
	}) => void;
	deleteMemberHandler: (memberId: string) => void;
}

interface MemberState {
	isEditing: boolean;
	editValues: Partial<Member>;
}

export const MemberPanelList = ({ members, updateMemberHandler, deleteMemberHandler }: MemberPanelListType) => {
	const [memberStates, setMemberStates] = useState<Record<string, MemberState>>({});

	const startEditing = (member: Member) => {
		setMemberStates((prev) => ({
			...prev,
			[member._id]: {
				isEditing: true,
				editValues: {
					memberFullName: member.memberFullName,
					memberPoints: member.memberPoints,
					memberPhone: member.memberPhone,
					memberType: member.memberType,
					memberStatus: member.memberStatus,
				},
			},
		}));
	};

	const saveChanges = (memberId: string) => {
		const state = memberStates[memberId];
		if (state) {
			updateMemberHandler({
				_id: memberId,
				...state.editValues,
			});
			setMemberStates((prev) => ({
				...prev,
				[memberId]: {
					isEditing: false,
					editValues: {},
				},
			}));
		}
	};

	const cancelEditing = (memberId: string) => {
		setMemberStates((prev) => ({
			...prev,
			[memberId]: {
				isEditing: false,
				editValues: {},
			},
		}));
	};

	const updateEditValues = (memberId: string, updates: Partial<Member>) => {
		setMemberStates((prev) => ({
			...prev,
			[memberId]: {
				...prev[memberId],
				editValues: {
					...prev[memberId].editValues,
					...updates,
				},
			},
		}));
	};

	return (
		<div className="rounded-md border border-input bg-card">
			<Table>
				<TableHeader>
					<TableRow className="bg-card hover:bg-accent/50">
						<TableHead className="w-[10%] text-muted-foreground">ID</TableHead>
						<TableHead className="w-[20%] text-muted-foreground">NICKNAME</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">FULL NAME</TableHead>
						<TableHead className="w-[15%] text-muted-foreground">PHONE NUMBER</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">POINTS</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">STATUS</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">TYPE</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{members.length === 0 ? (
						<TableRow>
							<TableCell colSpan={8} className="text-center">
								<span className="text-muted-foreground">No data found!</span>
							</TableCell>
						</TableRow>
					) : (
						members.map((member) => {
							const state = memberStates[member._id] || { isEditing: false, editValues: {} };
							const isEditing = state.isEditing;
							const editValues = state.editValues;

							return (
								<TableRow key={member._id} className="hover:bg-accent/50">
									<TableCell className="font-medium text-foreground">{member._id}</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Avatar className="h-8 w-8 border border-input">
												<AvatarImage src={member.memberImage} alt={member.username} />
												<AvatarFallback className="bg-muted text-muted-foreground">{member.username[0]}</AvatarFallback>
											</Avatar>
											{member.memberType === MemberType.ORGANIZER ? (
												<Link
													href={`/organizer/${member._id}`}
													className="font-medium text-foreground underline hover:text-primary hover:underline "
												>
													{member.username}
												</Link>
											) : (
												<span className="font-medium text-foreground">{member.username}</span>
											)}
										</div>
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Input
												value={editValues.memberFullName ?? member.memberFullName ?? ''}
												onChange={(e) => updateEditValues(member._id, { memberFullName: e.target.value })}
												className="w-full bg-background text-foreground border-input focus:ring-primary"
											/>
										) : (
											<span className="text-foreground">{member.memberFullName ?? '-'}</span>
										)}
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Input
												value={editValues.memberPhone ?? member.memberPhone ?? ''}
												onChange={(e) => updateEditValues(member._id, { memberPhone: e.target.value })}
												className="w-full bg-background text-foreground border-input focus:ring-primary"
											/>
										) : (
											<span className="text-foreground">{member.memberPhone ?? '-'}</span>
										)}
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Input
												type="number"
												value={editValues.memberPoints ?? member.memberPoints ?? 0}
												onChange={(e) => updateEditValues(member._id, { memberPoints: parseInt(e.target.value) })}
												className="w-full bg-background text-foreground border-input focus:ring-primary"
											/>
										) : (
											<span className="text-foreground">{member.memberPoints ?? 0}</span>
										)}
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Select
												value={editValues.memberStatus ?? member.memberStatus}
												onValueChange={(value) => updateEditValues(member._id, { memberStatus: value as MemberStatus })}
											>
												<SelectTrigger className="w-full bg-background text-foreground border-input focus:ring-primary">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="bg-card text-foreground border-border">
													{Object.values(MemberStatus).map((status) => (
														<SelectItem key={status} value={status} className="text-foreground">
															{status}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										) : (
											<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
												{member.memberStatus}
											</Badge>
										)}
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Select
												value={editValues.memberType ?? member.memberType}
												onValueChange={(value) => updateEditValues(member._id, { memberType: value as MemberType })}
											>
												<SelectTrigger className="w-full bg-background text-foreground border-input focus:ring-primary">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="bg-card text-foreground border-border">
													{Object.values(MemberType).map((type) => (
														<SelectItem key={type} value={type} className="text-foreground">
															{type}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										) : (
											<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
												{member.memberType}
											</Badge>
										)}
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											{isEditing ? (
												<>
													<Button
														variant="outline"
														size="icon"
														onClick={() => saveChanges(member._id)}
														className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
													>
														<Save className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => cancelEditing(member._id)}
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
														onClick={() => startEditing(member)}
														className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => deleteMemberHandler(member._id)}
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
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
