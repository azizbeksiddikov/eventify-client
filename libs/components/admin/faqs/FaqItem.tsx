import React, { useState } from 'react';
import { Pencil, Save, X, Trash2 } from 'lucide-react';

import { Button } from '@/libs/components/ui/button';
import { Card, CardContent } from '@/libs/components/ui/card';
import FaqForm from '@/libs/components/admin/faqs/FaqForm';

import { Faq } from '@/libs/types/faq/faq';
import { FaqUpdate } from '@/libs/types/faq/faq.update';

interface FaqItemProps {
	faq: Faq;
	onUpdate: (faq: FaqUpdate) => Promise<void>;
	onRemove: (faqId: string) => Promise<void>;
}

const FaqItem = ({ faq, onUpdate, onRemove }: FaqItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedFaq, setEditedFaq] = useState<FaqUpdate>({
		_id: faq._id,
		faqGroup: faq.faqGroup,
		faqStatus: faq.faqStatus,
		faqQuestion: faq.faqQuestion,
		faqAnswer: faq.faqAnswer,
	});

	const handleSave = async () => {
		await onUpdate(editedFaq);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedFaq({
			_id: faq._id,
			faqGroup: faq.faqGroup,
			faqStatus: faq.faqStatus,
			faqQuestion: faq.faqQuestion,
			faqAnswer: faq.faqAnswer,
		});
		setIsEditing(false);
	};

	return (
		<Card>
			<CardContent>
				<div className="flex-1 space-y-4">
					{isEditing ? (
						<div className="flex flex-col gap-3">
							<FaqForm
								data={{
									faqGroup: editedFaq.faqGroup,
									faqStatus: editedFaq.faqStatus,
									faqQuestion: editedFaq.faqQuestion,
									faqAnswer: editedFaq.faqAnswer,
								}}
								onChange={(data) =>
									setEditedFaq({
										...editedFaq,
										...data,
									})
								}
							/>

							<div className="flex items-center gap-2 justify-end">
								<Button variant="outline" size="icon" onClick={handleCancel}>
									<X className="h-4 w-4" />
								</Button>
								<Button size="icon" onClick={handleSave}>
									<Save className="h-4 w-4" />
								</Button>
							</div>
						</div>
					) : (
						<>
							<div className="flex items-center flex-row justify-between">
								<div className="flex items-center gap-2">
									<span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{faq.faqGroup}</span>
									<span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{faq.faqStatus}</span>
								</div>
								<div className="flex items-start gap-2 ml-4">
									<Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button variant="destructive" size="icon" onClick={() => onRemove(faq._id)}>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<h3 className="text-lg font-semibold">{faq.faqQuestion}</h3>
							<p className="text-muted-foreground whitespace-pre-wrap">{faq.faqAnswer}</p>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default FaqItem;
