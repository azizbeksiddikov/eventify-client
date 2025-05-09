import { CommentGroup, CommentStatus } from '@/libs/enums/comment.enum';
import { MeLiked } from '@/libs/types/like/like';
import { Member, TotalCounter } from '@/libs/types/member/member';

export interface Comment {
	_id: string;
	commentStatus: CommentStatus;
	commentGroup: CommentGroup;
	commentContent: string;
	commentRefId: string;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;

	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Comments {
	list: Comment[];
	metaCounter: TotalCounter[];
}
