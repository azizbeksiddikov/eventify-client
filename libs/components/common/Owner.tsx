import { Member } from '@/libs/types/member/member';
import { Card } from '../ui/card';
import Image from 'next/image';
import { Crown, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import Link from 'next/link';

interface OwnerProps {
	member: Member;
}

const Owner = ({ member }: OwnerProps) => {
	return (
		<Card className="p-8 bg-card hover:bg-secondary/15 transition-all duration-300 shadow-sm hover:shadow-md border border-border/50">
			<h2 className="text-2xl font-semibold mb-6 text-card-foreground flex items-center gap-2">
				<Users className="w-5 h-5 text-card-foreground" />
				Group Owner
			</h2>
			<Link href={`/organizer/${member._id}`} className="block group hover:scale-105 transition-transform duration-300">
				<div className="flex items-center space-x-6">
					<div className="flex-shrink-0">
						<div className="w-20 h-20 rounded-xl overflow-hidden relative">
							<Image
								src={member.memberImage ?? '/images/default-avatar.jpg'}
								alt={member.memberFullName ?? 'Owner avatar'}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-200"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<h3 className="text-xl font-semibold text-card-foreground group-hover:text-card-foreground transition-colors duration-200">
								{member.memberFullName ?? 'No Name'}
							</h3>
							<Badge className="bg-yellow-100 text-yellow-800">
								<Crown className="h-3 w-3 mr-1" />
								Owner
							</Badge>
						</div>
						<p className="text-base text-card-foreground leading-relaxed group-hover:text-card-foreground/80 transition-colors duration-200">
							{member.memberDesc ?? 'No Description'}
						</p>
					</div>
				</div>
			</Link>
		</Card>
	);
};

export default Owner;
