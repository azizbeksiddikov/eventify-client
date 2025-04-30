import { useState } from 'react';
import { Button } from '@/libs/components/ui/button';
import { Textarea } from '@/libs/components/ui/textarea';
import { Avatar } from '@/libs/components/ui/avatar';
import { MessageSquare, Plus } from 'lucide-react';
import { Separator } from '@/libs/components/ui/separator';
import type { Comment } from '../../types/comment/comment';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';

interface CommentsProps {
	comments: Comment[];
	commentGroup: CommentGroup;
	commentRefId: string;
}

const CommentsComponent = ({ comments: initialComments, commentGroup, commentRefId }: CommentsProps) => {
	const [comments, setComments] = useState<Comment[]>(initialComments);
	const [newComment, setNewComment] = useState('');
	const [isWriting, setIsWriting] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newComment.trim()) {
			const newCommentObj: Comment = {
				_id: Date.now().toString(), // Temporary ID for frontend
				commentStatus: CommentStatus.ACTIVE,
				commentGroup,
				commentContent: newComment,
				commentRefId,
				memberId: 'current-user-id',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			setComments((prev) => [...prev, newCommentObj]);
			setNewComment('');
			setIsWriting(false);
		}
	};

	const totalComments = comments.length;

	return (
		<div className="rounded-xl  bg-card shadow-sm mt-5">
			<div className="p-8">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-foreground">Comments</h3>
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2 text-muted-foreground">
							<MessageSquare className="h-5 w-5" />
							<span className="text-sm font-medium">{totalComments} comments</span>
						</div>
						{!isWriting && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsWriting(true)}
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<Plus className="h-4 w-4 mr-2" />
								Write a comment
							</Button>
						)}
					</div>
				</div>

				<Separator className="mb-6" />

				{isWriting && (
					<>
						<form onSubmit={handleSubmit} className="mb-6">
							<div className="flex items-start space-x-4">
								<div className="flex-1 space-y-3">
									<Textarea
										placeholder="Write a comment..."
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
										className="min-h-[100px] resize-none text-sm"
									/>
									<div className="flex justify-end space-x-3">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => {
												setNewComment('');
												setIsWriting(false);
											}}
											className="text-muted-foreground hover:text-foreground"
										>
											Cancel
										</Button>
										<Button
											type="submit"
											size="sm"
											disabled={!newComment.trim()}
											className="bg-primary hover:bg-primary/90 text-primary-foreground"
										>
											Post Comment
										</Button>
									</div>
								</div>
							</div>
						</form>
						<Separator className="mb-6" />
					</>
				)}

				{totalComments <= 0 && !isWriting ? (
					<div className="text-center py-12">
						<div className="text-muted-foreground mb-4 text-sm">No comments yet</div>
						<Button
							variant="outline"
							onClick={() => setIsWriting(true)}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							Be the first to comment
						</Button>
					</div>
				) : (
					<div className="space-y-6">
						{comments.map((comment, index) => {
							const memberImage = !!comment.memberData?.memberImage
								? comment.memberData?.memberImage
								: 'img/default-avatar.png';
							const memberName = !!comment.memberData?.memberFullName ? comment.memberData?.memberFullName : 'No Name';

							return (
								<div key={comment._id}>
									<div className="flex space-x-4">
										<Avatar className="h-10 w-10 ">
											<img src={memberImage} alt={memberName} className="object-cover" />
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<h4 className="font-medium text-foreground text-sm">{memberName}</h4>
												<span className="text-xs text-muted-foreground">{comment.createdAt.toLocaleDateString()}</span>
											</div>
											<p className="mt-1.5 text-muted-foreground text-sm">{comment.commentContent}</p>
										</div>
									</div>
									{index < comments.length - 1 && <Separator className="my-6" />}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default CommentsComponent;
