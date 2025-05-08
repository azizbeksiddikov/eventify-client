import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';

import { Separator } from '@/libs/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/components/ui/tabs';
import { Button } from '@/libs/components/ui/button';
import { Card, CardContent } from '@/libs/components/ui/card';
import FaqItem from '@/libs/components/admin/faqs/FaqItem';
import FaqForm from '@/libs/components/admin/faqs/FaqForm';

import { FaqUpdate } from '@/libs/types/faq/faq.update';
import { FaqInput } from '@/libs/types/faq/faq.input';
import { FaqByGroup } from '@/libs/types/faq/faq';
import { FaqGroup, FaqStatus } from '@/libs/enums/faq.enum';

interface FaqsInquiryProps {
	faqByGroup: FaqByGroup[];
	createFaqHandler: (faq: FaqInput) => Promise<void>;
	updateFaqHandler: (faq: FaqUpdate) => Promise<void>;
	removeFaqHandler: (faqId: string) => Promise<void>;
	initialNewFaq?: FaqInput;
}

const FaqsModule = ({
	faqByGroup,
	createFaqHandler,
	updateFaqHandler,
	removeFaqHandler,
	initialNewFaq = {
		faqGroup: FaqGroup.ACCOUNT,
		faqStatus: FaqStatus.ACTIVE,
		faqQuestion: '',
		faqAnswer: '',
	},
}: FaqsInquiryProps) => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<FaqGroup | ''>('');
	const [isCreating, setIsCreating] = useState(false);
	const [newFaq, setNewFaq] = useState<FaqInput>(initialNewFaq);

	useEffect(() => {
		if (faqByGroup.length > 0) {
			setActiveTab(faqByGroup[0].faqGroup);
		}
	}, [faqByGroup]);

	const handleCreateFaq = async () => {
		if (!newFaq.faqQuestion || !newFaq.faqAnswer) return;
		await createFaqHandler(newFaq);
		setNewFaq(initialNewFaq);
		setIsCreating(false);
	};

	const handleCancelCreate = () => {
		setNewFaq(initialNewFaq);
		setIsCreating(false);
	};

	const toggleCreateForm = () => {
		if (isCreating) {
			handleCancelCreate();
		} else {
			setIsCreating(true);
		}
	};

	const handleTabChange = (value: string) => {
		const newGroup = value as FaqGroup;
		setActiveTab(newGroup);
		setIsCreating(false);
		setNewFaq(initialNewFaq);
	};

	return (
		<div className="p-6 bg-background">
			<h2 className="text-2xl font-bold mb-6 text-foreground">{t('FAQ Management')}</h2>
			<div className="bg-card rounded-lg shadow border border-border">
				<Separator className="bg-border" />

				<div className="container max-w-4xl mx-auto my-10">
					<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
						<TabsList className="grid w-full grid-cols-3 mb-8 h-12">
							{faqByGroup.map((group) => (
								<TabsTrigger key={group.faqGroup} value={group.faqGroup} className="text-base font-medium">
									{group.faqGroup}
								</TabsTrigger>
							))}
						</TabsList>
						{faqByGroup.map((group) => (
							<TabsContent key={group.faqGroup} value={group.faqGroup}>
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<h3 className="text-lg font-semibold">
											{group.faqGroup} {t('FAQs')}
										</h3>
										<Button onClick={toggleCreateForm} variant={isCreating ? 'outline' : 'default'}>
											{isCreating ? (
												<>
													<X className="w-4 h-4 mr-2" />
													{t('Close')}
												</>
											) : (
												<>
													<Plus className="w-4 h-4 mr-2" />
													{t('Add FAQ')}
												</>
											)}
										</Button>
									</div>

									{isCreating && activeTab === group.faqGroup && (
										<Card className="bg-card">
											<CardContent className="p-6">
												<FaqForm
													data={{
														faqGroup: newFaq.faqGroup,
														faqStatus: newFaq.faqStatus,
														faqQuestion: newFaq.faqQuestion,
														faqAnswer: newFaq.faqAnswer,
													}}
													onChange={(data) =>
														setNewFaq({
															...newFaq,
															...data,
														})
													}
												/>
												<div className="flex justify-end space-x-2 pt-4">
													<Button variant="outline" onClick={handleCancelCreate}>
														{t('Cancel')}
													</Button>
													<Button onClick={handleCreateFaq}>{t('Create FAQ')}</Button>
												</div>
											</CardContent>
										</Card>
									)}

									<div className="space-y-4">
										{group.faqs.map((faq) => (
											<FaqItem key={faq._id} faq={faq} onUpdate={updateFaqHandler} onRemove={removeFaqHandler} />
										))}
									</div>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default FaqsModule;
