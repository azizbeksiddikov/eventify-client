import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/libs/components/ui/button';
import { Card } from '@/libs/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/libs/components/ui/avatar';
import { MessageSquare } from 'lucide-react';

interface Comment {
	id: string;
	user: {
		name: string;
		avatar: string;
	};
	text: string;
	date: Date;
}

interface CommentsProps {
	comments: Comment[];
	onAddComment: (comment: string) => void;
}

const Comments = ({ comments, onAddComment }: CommentsProps) => {
	const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
	const [newComment, setNewComment] = useState('');

	const handleAddComment = () => {
		if (newComment.trim()) {
			onAddComment(newComment);
			setNewComment('');
			setIsCommentModalOpen(false);
		}
	};

	return (
		<div className="mt-8">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold text-foreground">Comments</h2>
				<Button variant="outline" size="sm" onClick={() => setIsCommentModalOpen(true)}>
					<MessageSquare className="h-4 w-4 mr-2" />
					Add Comment
				</Button>
			</div>

			{/* Add Comment Modal */}
			{isCommentModalOpen && (
				<Card className="mb-6 p-6">
					<div className="space-y-4">
						<Textarea
							placeholder="Write your comment..."
							value={newComment}
							onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
							className="min-h-[100px]"
						/>
						<div className="flex justify-end space-x-2">
							<Button variant="outline" onClick={() => setIsCommentModalOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleAddComment} disabled={!newComment.trim()}>
								Post Comment
							</Button>
						</div>
					</div>
				</Card>
			)}

			<div className="space-y-6">
				{comments.map((comment) => (
					<Card key={comment.id} className="p-6">
						<div className="flex items-start space-x-4">
							<Avatar className="h-10 w-10">
								<AvatarImage src={comment.user.avatar} alt={comment.user.name} />
								<AvatarFallback>{comment.user.name[0]}</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<h4 className="font-medium text-foreground">{comment.user.name}</h4>
									<span className="text-xs text-muted-foreground">{comment.date?.toLocaleDateString()}</span>
								</div>
								<p className="mt-2 text-muted-foreground">{comment.text}</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default Comments;
