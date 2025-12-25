"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { ChevronDown } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/libs/components/ui/tabs";

import { FaqByGroup } from "@/libs/types/faq/faq";
import { FaqGroup, FaqStatus } from "@/libs/enums/faq.enum";
import { cn } from "@/libs/utils";

// Custom Accordion Item Component
interface FAQAccordionItemProps {
	faq: {
		_id: string;
		faqQuestion: string;
		faqAnswer: string;
	};
	isOpen: boolean;
	onToggle: () => void;
}

const FAQAccordionItem = ({ faq, isOpen, onToggle }: FAQAccordionItemProps) => {
	return (
		<div className="border rounded-md shadow-none last:mb-0 overflow-hidden">
			<button
				onClick={onToggle}
				className="w-full flex items-center justify-between text-left text-sm sm:text-lg font-medium p-4 bg-muted/10 rounded-md hover:bg-muted/20 transition-colors"
			>
				<span className="flex-1 pr-4">{faq.faqQuestion}</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
						isOpen && "rotate-180",
					)}
				/>
			</button>
			<div
				className={cn(
					"overflow-hidden transition-all duration-300 ease-in-out",
					isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
				)}
			>
				<div className="text-sm sm:text-base text-muted-foreground px-4 py-2">{faq.faqAnswer}</div>
			</div>
		</div>
	);
};

const HelpPage = () => {
	const { t } = useTranslation("help");

	// Hard-coded FAQ data with translations
	const faqByGroup: FaqByGroup[] = useMemo(() => {
		const accountFaqs =
			(t("faqs_account", { returnObjects: true }) as Array<{ question: string; answer: string }>) || [];
		const eventsFaqs = (t("faqs_events", { returnObjects: true }) as Array<{ question: string; answer: string }>) || [];
		const groupsFaqs = (t("faqs_groups", { returnObjects: true }) as Array<{ question: string; answer: string }>) || [];

		return [
			{
				faqGroup: FaqGroup.ACCOUNT,
				faqs: accountFaqs.map((faq, index) => ({
					_id: `account-${index}`,
					faqGroup: FaqGroup.ACCOUNT,
					faqStatus: FaqStatus.ACTIVE,
					faqQuestion: faq.question,
					faqAnswer: faq.answer,
					createdAt: new Date(),
					updatedAt: new Date(),
				})),
			},
			{
				faqGroup: FaqGroup.EVENTS,
				faqs: eventsFaqs.map((faq, index) => ({
					_id: `events-${index}`,
					faqGroup: FaqGroup.EVENTS,
					faqStatus: FaqStatus.ACTIVE,
					faqQuestion: faq.question,
					faqAnswer: faq.answer,
					createdAt: new Date(),
					updatedAt: new Date(),
				})),
			},
			{
				faqGroup: FaqGroup.GROUPS,
				faqs: groupsFaqs.map((faq, index) => ({
					_id: `groups-${index}`,
					faqGroup: FaqGroup.GROUPS,
					faqStatus: FaqStatus.ACTIVE,
					faqQuestion: faq.question,
					faqAnswer: faq.answer,
					createdAt: new Date(),
					updatedAt: new Date(),
				})),
			},
		];
	}, [t]);

	const defaultTab = faqByGroup[0]?.faqGroup || "";
	const [activeTab, setActiveTab] = useState<string>(defaultTab);
	// Track which FAQ item is open in each group (only one can be open at a time per group)
	const [openItems, setOpenItems] = useState<Record<string, string>>({});

	const toggleFAQ = (groupKey: string, faqId: string) => {
		setOpenItems((prev) => {
			// If clicking the same item that's open, close it
			if (prev[groupKey] === faqId) {
				const newState = { ...prev };
				delete newState[groupKey];
				return newState;
			}
			// Otherwise, open the clicked item
			return {
				...prev,
				[groupKey]: faqId,
			};
		});
	};

	return (
		<div className="max-w-7xl mx-auto my-10 px-6 sm:px-12 lg:px-20">
			{/* Header Section */}
			<div className="text-center mb-10 sm:mb-16">
				<h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">{t("how_can_we_help")}</h1>
				<p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">{t("help_description")}</p>
			</div>

			{/* Tabs Section */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				{/* Tabs List - Scrollable on mobile or wrapped */}
				<TabsList className="w-full h-auto flex flex-wrap sm:grid sm:grid-cols-3 gap-2 px-1 py-1 5">
					{faqByGroup.map((group) => (
						<TabsTrigger
							key={group.faqGroup}
							value={group.faqGroup}
							className="text-sm sm:text-base font-medium flex-1"
						>
							{t(`faq_groups.${group.faqGroup}`)}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Tabs Content */}
				{faqByGroup.map((group) => (
					<TabsContent key={group.faqGroup} value={group.faqGroup}>
						<div className="w-full space-y-4">
							{group.faqs.map((faq) => (
								<FAQAccordionItem
									key={faq._id}
									faq={faq}
									isOpen={openItems[group.faqGroup] === faq._id}
									onToggle={() => toggleFAQ(group.faqGroup, faq._id)}
								/>
							))}
						</div>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
};

export default HelpPage;
