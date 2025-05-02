import { toast } from 'sonner';

type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const commonToastOptions = {
	closeButton: true,
	onClick: () => toast.dismiss(),
};

export const smallSuccess = (message: string, position?: ToastPosition, duration?: number) => {
	toast.success(message, {
		position: position ?? 'top-right',
		duration: duration ?? 2000,
		className: 'bg-success text-success-foreground mx-auto',
		...commonToastOptions,
	});
};

export const smallError = (message: string, position?: ToastPosition, duration?: number) => {
	toast.error(message, {
		position: position ?? 'top-right',
		duration: duration ?? 2000,
		className: 'bg-destructive text-destructive-foreground mx-auto',
		...commonToastOptions,
	});
};

export const smallInfo = (message: string, position?: ToastPosition, duration?: number) => {
	toast.info(message, {
		position: position ?? 'top-right',
		duration: duration ?? 2000,
		className: 'bg-info text-info-foreground mx-auto',
		...commonToastOptions,
	});
};
