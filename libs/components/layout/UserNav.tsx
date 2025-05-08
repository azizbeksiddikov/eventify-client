import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { User } from 'lucide-react';

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

import { logOut } from '@/libs/auth';
import { Member } from '@/libs/types/member/member';
import { REACT_APP_API_URL } from '@/libs/config';
export function UserNav({ authMember }: { authMember: Member }) {
	const router = useRouter();
	const { t } = useTranslation('common');
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-10 w-10 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src={`${REACT_APP_API_URL}/${authMember?.memberImage}`} alt={authMember?.memberFullName} />
						<AvatarFallback>
							<User className="h-4 w-4" />
						</AvatarFallback>
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
					<DropdownMenuItem onClick={() => router.push('/profile')}>{t('Profile')}</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logOut}>{t('Log out')}</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
