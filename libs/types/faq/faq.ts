import { FaqGroup, FaqStatus } from '@/libs/enums/faq.enum';

export interface Faq {
	_id: string;
	faqGroup: FaqGroup;
	faqStatus: FaqStatus;
	faqQuestion: string;
	faqAnswer: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface FaqByGroup {
	faqGroup: FaqGroup;
	faqs: Faq[];
}
