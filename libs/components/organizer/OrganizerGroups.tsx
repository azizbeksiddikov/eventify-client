import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/libs/components/ui/card';
import { Users } from 'lucide-react';
import { Group } from '@/libs/types/group/group';

interface OrganizerGroupsProps {
	groups: Group[];
}

const OrganizerGroups = ({ groups }: OrganizerGroupsProps) => {
	return (
		<Card className="p-6">
			<h3 className="text-lg font-semibold text-foreground mb-4">Admin Groups</h3>
			<div className="space-y-4">
				{groups.map((group) => (
					<Link key={group._id} href={`/groups/${group._id}`}>
						<div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
							<div className="relative w-12 h-12 rounded-lg overflow-hidden">
								<Image src={group.groupImage} alt={group.groupName} fill className="object-cover" />
							</div>
							<div>
								<h4 className="font-semibold text-foreground">{group.groupName}</h4>
								<div className="flex items-center space-x-2 text-sm text-muted-foreground">
									<Users className="h-4 w-4" />
									<span>{group.memberCount} members</span>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
		</Card>
	);
};

export default OrganizerGroups;
