import React, { useState } from 'react';
import { Group } from '@/libs/types/group/group';
import { GroupPanelList } from '@/libs/components/admin/groups/GroupList';
import { GroupSearch } from '@/libs/components/admin/groups/GroupSearch';
import { mockGroups } from '@/data';
import { sweetMixinSuccessAlert, sweetMixinErrorAlert } from '@/libs/sweetAlert';
import withAdminLayout from '@/libs/components/layout/LayoutAdmin';
import { Button } from '@/libs/components/ui/button';
import { Separator } from '@/libs/components/ui/separator';
import { Direction } from '@/libs/enums/common.enum';
import { GroupCategory } from '@/libs/enums/group.enum';

interface GroupsInquiry {
	page: number;
	limit: number;
	sort: string;
	direction: Direction;
	search: {
		text: string;
		category?: GroupCategory;
	};
}

const defaultInquiry: GroupsInquiry = {
	page: 1,
	limit: 10,
	sort: 'createdAt',
	direction: Direction.DESC,
	search: {
		text: '',
	},
};

const GroupsPage = () => {
	const [groupsInquiry, setGroupsInquiry] = useState<GroupsInquiry>(defaultInquiry);
	const [groups, setGroups] = useState<Group[]>(mockGroups);
	const groupsTotal = groups.length;

	const updateGroupHandler = async (data: {
		_id: string;
		groupName?: string;
		groupDesc?: string;
		groupImage?: string;
	}) => {
		try {
			// Simulate API call delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			setGroups((prev) =>
				prev.map((group) => {
					if (group._id === data._id) {
						return {
							...group,
							groupName: data.groupName ?? group.groupName,
							groupDesc: data.groupDesc ?? group.groupDesc,
							groupImage: data.groupImage ?? group.groupImage,
							updatedAt: new Date(),
						};
					}
					return group;
				}),
			);
			await sweetMixinSuccessAlert('Group updated successfully');
		} catch {
			await sweetMixinErrorAlert('Failed to update group');
		}
	};

	const changePageHandler = async (_event: unknown, newPage: number) => {
		groupsInquiry.page = newPage + 1;
		setGroupsInquiry({ ...groupsInquiry });
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">Groups List</h2>
			<div className="bg-card rounded-lg shadow border border-border">
				<GroupSearch groupsInquiry={groupsInquiry} setGroupsInquiry={setGroupsInquiry} />
				<Separator className="bg-border" />
				<div className="p-6">
					<GroupPanelList groups={groups} updateGroupHandler={updateGroupHandler} />
					<div className="mt-4 flex items-center justify-between">
						<div className="text-sm text-muted-foreground">
							Showing {groupsInquiry.limit} of {groupsTotal} results
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => changePageHandler(null, groupsInquiry.page - 2)}
								disabled={groupsInquiry.page === 1}
								className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground"
							>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => changePageHandler(null, groupsInquiry.page)}
								disabled={groupsInquiry.page * groupsInquiry.limit >= groupsTotal}
								className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground disabled:bg-muted disabled:text-muted-foreground"
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withAdminLayout(GroupsPage);
