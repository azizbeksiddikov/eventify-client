import { EventStatus, EventCategory } from '@/libs/enums/event.enum';
import { Member, TotalCounter } from '@/libs/types/member/member';
import { Group } from '@/libs/types/group/group';
import { MeLiked } from '@/libs/types/like/like';

export interface Event {
	_id: string;
	eventName: string;
	eventDesc: string;
	eventImage: string;
	eventDate: Date;
	eventStartTime: string;
	eventEndTime: string;
	eventAddress: string;
	eventCapacity: number;
	eventPrice: number;
	eventStatus: EventStatus;
	eventCategories: EventCategory[];
	groupId: string;
	memberId: string;
	attendeeCount: number;
	eventLikes: number;
	eventViews: number;
	createdAt: Date;
	updatedAt: Date;
	eventCity: string;

	memberData?: Member;
	meLiked?: MeLiked[];
	hostingGroup?: Group;
	similarEvents?: Event[];
}

export interface Events {
	list: Event[];
	metaCounter: TotalCounter[];
}

export interface CategoryEvents {
	category: EventCategory;
	events: Event[];
}
