import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

import { Button } from "@/libs/components/ui/button";

interface EmptyStateProps {
	message: string;
	actionLabel?: string;
	onAction?: () => void;
	icon?: ReactNode;
}

/** Says what happened and offers the next step (e.g. clearing filters). */
export function EmptyState({ message, actionLabel, onAction, icon }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
				{icon ?? <SearchX className="h-6 w-6" />}
			</div>
			<p className="max-w-xs text-muted-foreground">{message}</p>
			{actionLabel && onAction && (
				<Button variant="outline" className="h-11 fine:h-9" onClick={onAction}>
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
