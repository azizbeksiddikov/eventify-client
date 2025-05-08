import { FaqGroup, FaqStatus } from '@/libs/enums/faq.enum';

export interface FaqInput {
	faqGroup: FaqGroup;
	faqStatus: FaqStatus;
	faqQuestion: string;
	faqAnswer: string;
}
