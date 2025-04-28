import { Button } from '@/libs/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/libs/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorComponentProps {
	message: string;
	onRetry?: () => void;
}

const ErrorComponent = ({ message, onRetry }: ErrorComponentProps) => {
	return (
		<div className="min-h-screen bg-background py-12">
			<div className="max-w-md mx-auto px-4">
				<Card className="bg-card">
					<CardHeader>
						<CardTitle className="text-card-foreground text-2xl font-semibold flex items-center gap-2">
							<AlertCircle className="h-6 w-6 text-destructive" />
							Error
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-card-foreground">{message}</p>
						{onRetry && (
							<Button onClick={onRetry} className="bg-primary text-primary-foreground hover:bg-primary/90">
								Try Again
							</Button>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ErrorComponent;
