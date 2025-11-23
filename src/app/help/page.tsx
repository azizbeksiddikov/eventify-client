"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useTranslation } from "next-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/libs/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/libs/components/ui/accordion";

import { GET_FAQS } from "@/apollo/user/query";
import { FaqByGroup } from "@/libs/types/faq/faq";

const HelpPage = () => {
	const { t } = useTranslation();

	/** APOLLO REQUESTS */
	const { data: getFaqsData } = useQuery(GET_FAQS, {
		fetchPolicy: "cache-first",
		notifyOnNetworkStatusChange: true,
	});

	const faqByGroup: FaqByGroup[] = useMemo(() => getFaqsData?.getFaqs || [], [getFaqsData?.getFaqs]);

	const defaultTab = faqByGroup[0]?.faqGroup || "";
	const [activeTab, setActiveTab] = useState<string>(defaultTab);

	return (
		<div className="max-w-4xl mx-auto my-10 px-4">
			{/* Header Section */}
			<div className="text-center mb-16">
				<h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">{t("How can we help you?")}</h1>
				<p className="text-base sm:text-lg text-muted-foreground">
					{t("Find answers to common questions or get in touch with our support team.")}
				</p>
			</div>

			{/* Tabs Section */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				{/* Tabs List */}
				<TabsList className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 h-10 sm:h-12 w-full">
					{faqByGroup.map((group) => (
						<TabsTrigger
							key={group.faqGroup}
							value={group.faqGroup}
							className="text-sm sm:text-base font-medium px-2 py-1"
						>
							{group.faqGroup}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Tabs Content */}
				{faqByGroup.map((group) => (
					<TabsContent key={group.faqGroup} value={group.faqGroup}>
						<Accordion type="single" collapsible className="w-full space-y-4">
							{group.faqs.map((faq, index) => (
								<AccordionItem
									key={faq._id}
									value={`item-${index}`}
									className="border rounded-md shadow-none last:mb-0"
								>
									<AccordionTrigger className="text-sm sm:text-lg font-medium p-4 bg-muted/10 rounded-md">
										{faq.faqQuestion}
									</AccordionTrigger>
									<AccordionContent className="text-sm sm:text-base text-muted-foreground px-4 py-2">
										{faq.faqAnswer}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default HelpPage;
