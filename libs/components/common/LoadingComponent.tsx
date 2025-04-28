import { Loader2 } from 'lucide-react';

interface LoadingComponentProps {
	message?: string;
}

const LoadingComponent = ({ message = 'Loading...' }: LoadingComponentProps) => {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<p className="text-card-foreground">{message}</p>
			</div>
		</div>
	);
};

export default LoadingComponent;
