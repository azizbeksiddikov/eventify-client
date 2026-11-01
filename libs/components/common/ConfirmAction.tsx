"use client";

import { ReactNode, useState } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/libs/components/ui/alert-dialog";
import { Button } from "@/libs/components/ui/button";

interface ConfirmActionProps {
	/** The button that starts the action (rendered as the dialog trigger). Omit it to control the dialog with open/onOpenChange. */
	children?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title: string;
	description: string;
	confirmLabel: string;
	cancelLabel: string;
	onConfirm: () => void | Promise<void>;
	/** Red confirm button for destructive actions (default true). */
	destructive?: boolean;
}

/**
 * Asks "are you sure?" before a destructive action. The trigger is your own button; the
 * dialog says what will happen, offers Cancel first (so a slip does not destroy anything)
 * and shows a pending state on the confirm button while the request runs.
 */
export const ConfirmAction = ({
	children,
	open: controlledOpen,
	onOpenChange,
	title,
	description,
	confirmLabel,
	cancelLabel,
	onConfirm,
	destructive = true,
}: ConfirmActionProps) => {
	const [innerOpen, setInnerOpen] = useState(false);
	const open = controlledOpen ?? innerOpen;
	const setOpen = onOpenChange ?? setInnerOpen;
	const [pending, setPending] = useState(false);

	const confirm = async () => {
		setPending(true);
		try {
			await onConfirm();
		} finally {
			setPending(false);
			setOpen(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
			{children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending} className="h-11 fine:h-9">
						{cancelLabel}
					</AlertDialogCancel>
					<Button
						type="button"
						variant={destructive ? "destructive" : "default"}
						className="h-11 fine:h-9"
						disabled={pending}
						onClick={confirm}
					>
						{confirmLabel}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
