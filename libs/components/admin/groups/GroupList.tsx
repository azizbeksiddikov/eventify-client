import React, { useState } from 'react';
import Link from 'next/link';
import { Group } from '../../../types/group/group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/libs/components/ui/table';
import { Button } from '@/libs/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Input } from '@/libs/components/ui/input';
import { Edit, Save, X, Trash2 } from 'lucide-react';
import { Badge } from '@/libs/components/ui/badge';
import { REACT_APP_API_URL } from '@/libs/config';

interface GroupPanelListType {
	groups: Group[];
	updateGroupHandler: (data: { _id: string; groupName?: string; groupDesc?: string; groupImage?: string }) => void;
	deleteGroupHandler: (groupId: string) => void;
}

interface GroupState {
	isEditing: boolean;
	editValues: Partial<Group>;
}

export const GroupPanelList = ({ groups, updateGroupHandler, deleteGroupHandler }: GroupPanelListType) => {
	const [groupStates, setGroupStates] = useState<Record<string, GroupState>>({});

	const startEditing = (group: Group) => {
		setGroupStates((prev) => ({
			...prev,
			[group._id]: {
				isEditing: true,
				editValues: {
					groupName: group.groupName,
					groupDesc: group.groupDesc,
					groupImage: group.groupImage,
				},
			},
		}));
	};

	const saveChanges = (groupId: string) => {
		const state = groupStates[groupId];
		if (state) {
			updateGroupHandler({
				_id: groupId,
				...state.editValues,
			});
			setGroupStates((prev) => ({
				...prev,
				[groupId]: {
					isEditing: false,
					editValues: {},
				},
			}));
		}
	};

	const cancelEditing = (groupId: string) => {
		setGroupStates((prev) => ({
			...prev,
			[groupId]: {
				isEditing: false,
				editValues: {},
			},
		}));
	};

	const updateEditValues = (groupId: string, updates: Partial<Group>) => {
		setGroupStates((prev) => ({
			...prev,
			[groupId]: {
				...prev[groupId],
				editValues: {
					...prev[groupId].editValues,
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
						<TableHead className="w-[20%] text-muted-foreground">GROUP</TableHead>
						<TableHead className="w-[30%] text-muted-foreground">DESCRIPTION</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">MEMBERS</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">EVENTS</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">VIEWS</TableHead>
						<TableHead className="w-[10%] text-muted-foreground">ACTIONS</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{groups.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center">
								<span className="text-muted-foreground">No data found!</span>
							</TableCell>
						</TableRow>
					) : (
						groups.map((group) => {
							const state = groupStates[group._id] || { isEditing: false, editValues: {} };
							const isEditing = state.isEditing;
							const editValues = state.editValues;

							return (
								<TableRow key={group._id} className="hover:bg-accent/50">
									<TableCell className="font-medium text-foreground">{group._id}</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Avatar className="h-8 w-8 border border-input">
												<AvatarImage src={`${REACT_APP_API_URL}/${group.groupImage}`} alt={group.groupName} />
												<AvatarFallback className="bg-muted text-muted-foreground">{group.groupName[0]}</AvatarFallback>
											</Avatar>
											{isEditing ? (
												<Input
													value={editValues.groupName ?? group.groupName ?? ''}
													onChange={(e) => updateEditValues(group._id, { groupName: e.target.value })}
													className="w-full bg-background text-foreground border-input focus:ring-primary"
												/>
											) : (
												<Link
													href={`/group/${group._id}`}
													className="font-medium text-foreground underline hover:text-primary hover:underline"
												>
													{group.groupName}
												</Link>
											)}
										</div>
									</TableCell>
									<TableCell>
										{isEditing ? (
											<Input
												value={editValues.groupDesc ?? group.groupDesc ?? ''}
												onChange={(e) => updateEditValues(group._id, { groupDesc: e.target.value })}
												className="w-full bg-background text-foreground border-input focus:ring-primary"
											/>
										) : (
											<span className="text-foreground">{group.groupDesc ?? '-'}</span>
										)}
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
											{group.memberCount}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
											{group.eventsCount}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="w-full justify-center bg-card text-foreground border-input">
											{group.groupViews}
										</Badge>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											{isEditing ? (
												<>
													<Button
														variant="outline"
														size="icon"
														onClick={() => saveChanges(group._id)}
														className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
													>
														<Save className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => cancelEditing(group._id)}
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
														onClick={() => startEditing(group)}
														className="text-primary hover:bg-primary hover:text-primary-foreground border-primary"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="outline"
														size="icon"
														onClick={() => deleteGroupHandler(group._id)}
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
