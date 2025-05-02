import { EventStatus, EventCategory } from '../../enums/event.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

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
	eventOrganizerId: string;
	attendeeCount: number;
	eventLikes: number;
	eventViews: number;
	createdAt: Date;
	updatedAt: Date;
	eventCity: string;

	memberData?: Member;
	meLiked?: MeLiked[];
}

export interface Events {
	list: Event[];
	metaCounter: TotalCounter[];
}

export interface CategoryEvents {
	category: EventCategory;
	events: Event[];
}
