import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';
import { Button } from '@/libs/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/libs/components/ui/dropdown-menu';
import { Member } from '@/libs/types/member/member';
import { useRouter } from 'next/router';

export function UserNav({ handleLogout, authMember }: { handleLogout: () => void; authMember: Member }) {
	const router = useRouter();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src="/avatars/01.png" alt="@shadcn" />
						<AvatarFallback>SP</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{authMember.memberFullName}</p>
						<p className="text-xs leading-none text-muted-foreground">{authMember.memberEmail}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
