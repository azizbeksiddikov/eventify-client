import { useTranslation } from 'next-i18next';

import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/libs/components/ui/select';
import { MembersInquiry } from '@/libs/types/member/member.input';
import { Direction } from '@/libs/enums/common.enum';
import { MemberStatus, MemberType } from '@/libs/enums/member.enum';

interface MemberSearchProps {
	initialInquiry: MembersInquiry;
	membersInquiry: MembersInquiry;
	setMembersInquiry: (inquiry: MembersInquiry) => void;
}

export function MemberSearch({ initialInquiry, membersInquiry, setMembersInquiry }: MemberSearchProps) {
	const { t } = useTranslation();

	/**	 HANDLERS */
	const searchTextHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				text: e.target.value,
			},
		});
	};

	const inputFieldHandler = (field: string, value: number | string) => {
		setMembersInquiry({
			...membersInquiry,
			[field]: value,
		});
	};

	const changeTypeHandler = (value: string) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				memberType: value === 'all' ? undefined : (value as MemberType),
			},
		});
	};

	const changeStatusHandler = (value: string) => {
		setMembersInquiry({
			...membersInquiry,
			search: {
				...membersInquiry.search,
				memberStatus: value === 'all' ? undefined : (value as MemberStatus),
			},
		});
	};

	const clearAllHandler = () => {
		setMembersInquiry(initialInquiry);
	};

	return (
		<div className="flex items-center gap-6 p-6 rounded-t-lg bg-card border border-border">
			{/* SEARCH */}
			<Input
				placeholder={t('Search members...')}
				value={membersInquiry?.search?.text ?? ''}
				onChange={searchTextHandler}
				className="w-full bg-background text-foreground border-input focus:ring-primary"
			/>

			{/* FILTER BY TYPE */}
			<Select
				value={membersInquiry?.search?.memberType ?? 'all'}
				onValueChange={(value) => {
					changeTypeHandler(value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t('Filter by type')} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="all">{t('All Types')}</SelectItem>
					<SelectItem value={MemberType.ORGANIZER}>{t('Organizer')}</SelectItem>
					<SelectItem value={MemberType.USER}>{t('User')}</SelectItem>
				</SelectContent>
			</Select>

			{/* FILTER BY STATUS */}
			<Select value={membersInquiry?.search?.memberStatus ?? 'all'} onValueChange={changeStatusHandler}>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t('Filter by status')} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="all">{t('All Statuses')}</SelectItem>
					<SelectItem value={MemberStatus.ACTIVE}>{t('Active')}</SelectItem>
					<SelectItem value={MemberStatus.BLOCKED}>{t('Blocked')}</SelectItem>
				</SelectContent>
			</Select>

			{/* SORT */}
			<Select
				value={membersInquiry?.sort}
				onValueChange={(value: string) => {
					inputFieldHandler('sort', value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t('Sort by')} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value="createdAt">{t('Created At')}</SelectItem>
					<SelectItem value="memberPoints">{t('Points')}</SelectItem>
					<SelectItem value="memberFullName">{t('Full Name')}</SelectItem>
				</SelectContent>
			</Select>

			{/* Direction */}
			<Select
				value={membersInquiry?.direction}
				onValueChange={(value: Direction) => {
					inputFieldHandler('direction', value);
				}}
			>
				<SelectTrigger className="w-[180px] bg-background text-foreground border-input focus:ring-primary">
					<SelectValue placeholder={t('Direction')} />
				</SelectTrigger>
				<SelectContent className="bg-card text-foreground border-border">
					<SelectItem value={Direction.ASC}>{t('Ascending')}</SelectItem>
					<SelectItem value={Direction.DESC}>{t('Descending')}</SelectItem>
				</SelectContent>
			</Select>

			{/* Clear */}
			<Button
				variant="outline"
				onClick={clearAllHandler}
				className="bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
			>
				{t('Clear')}
			</Button>
		</div>
	);
}
