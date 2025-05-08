import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'next-i18next';

import withBasicLayout from '@/libs/components/layout/LayoutBasic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/libs/components/ui/accordion';

import { GET_FAQS } from '@/apollo/user/query';
import { FaqByGroup } from '@/libs/types/faq/faq';

const HelpPage = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<string>('');
	const [faqByGroup, setFaqByGroup] = useState<FaqByGroup[]>([]);

	/** APOLLO REQUESTS */
	const { data: getFaqsData } = useQuery(GET_FAQS, {
		fetchPolicy: 'cache-first',
		notifyOnNetworkStatusChange: true,
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (getFaqsData?.getFaqs) {
			setFaqByGroup(getFaqsData.getFaqs);
			if (getFaqsData.getFaqs[0]?.faqGroup) {
				setActiveTab(getFaqsData.getFaqs[0].faqGroup);
			}
		}
	}, [getFaqsData]);

	return (
		<div className="container max-w-4xl mx-auto my-10">
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold mb-4 text-foreground">{t('How can we help you?')}</h1>
				<p className="text-muted-foreground text-lg">
					{t('Find answers to common questions or get in touch with our support team.')}
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3 mb-8 h-12 ">
					{faqByGroup.map((group) => (
						<TabsTrigger key={group.faqGroup} value={group.faqGroup} className="text-base font-medium">
							{group.faqGroup}
						</TabsTrigger>
					))}
				</TabsList>
				{faqByGroup.map((group) => (
					<TabsContent key={group.faqGroup} value={group.faqGroup}>
						<Accordion type="single" collapsible className="w-full">
							{group.faqs.map((faq, index) => (
								<AccordionItem key={faq._id} value={`item-${index}`}>
									<AccordionTrigger className="text-lg font-medium">{faq.faqQuestion}</AccordionTrigger>
									<AccordionContent className="text-muted-foreground">{faq.faqAnswer}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default withBasicLayout(HelpPage);
