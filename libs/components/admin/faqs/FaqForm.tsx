import React from "react";
import { useTranslation } from "next-i18next";

import { Input } from "@/libs/components/ui/input";
import { Textarea } from "@/libs/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";

import { FaqGroup, FaqStatus } from "@/libs/enums/faq.enum";

interface FaqFormData {
	faqGroup?: FaqGroup;
	faqStatus?: FaqStatus;
	faqQuestion?: string;
	faqAnswer?: string;
}

interface FaqFormProps {
	data: FaqFormData;
	onChange: (data: FaqFormData) => void;
}

const FaqForm = ({ data, onChange }: FaqFormProps) => {
	const { t } = useTranslation("admin");
	const changeHandler = (field: keyof FaqFormData, value: string) => {
		onChange({ ...data, [field]: value });
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<label className="text-sm font-medium text-muted-foreground">{t("faq_group")}</label>
					<Select value={data.faqGroup} onValueChange={(value) => changeHandler("faqGroup", value as FaqGroup)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={t("select_group")} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(FaqGroup).map((group) => (
								<SelectItem key={group} value={group}>
									{group}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-muted-foreground">{t("status")}</label>
					<Select value={data.faqStatus} onValueChange={(value) => changeHandler("faqStatus", value as FaqStatus)}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={t("select_status")} />
						</SelectTrigger>
						<SelectContent>
							{Object.values(FaqStatus).map((status) => (
								<SelectItem key={status} value={status}>
									{status}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium text-muted-foreground">{t("question")}</label>
				<Input
					value={data.faqQuestion}
					onChange={(e) => changeHandler("faqQuestion", e.target.value)}
					className="bg-background"
					placeholder={t("enter_question")}
				/>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium text-muted-foreground">{t("answer")}</label>
				<Textarea
					value={data.faqAnswer}
					onChange={(e) => changeHandler("faqAnswer", e.target.value)}
					className="bg-background min-h-[150px] resize-none"
					placeholder={t("enter_answer")}
				/>
			</div>
		</div>
	);
};

export default FaqForm;
