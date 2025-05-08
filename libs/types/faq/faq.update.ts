import { FaqGroup, FaqStatus } from '@/libs/enums/faq.enum';

export interface FaqUpdate {
	_id: string;
	faqGroup?: FaqGroup;
	faqStatus?: FaqStatus;
	faqQuestion?: string;
	faqAnswer?: string;
}
