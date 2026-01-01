import { useState, useRef, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { useReactiveVar } from "@apollo/client/react";
import { useMutation, useQuery } from "@apollo/client/react";
import { MessageSquare, Plus, Pencil, Trash2, User, ChevronDown } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Textarea } from "@/libs/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/libs/components/ui/avatar";
import { Separator } from "@/libs/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/libs/components/ui/card";
import PaginationComponent from "@/libs/components/common/PaginationComponent";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";

import { GET_COMMENTS } from "@/apollo/user/query";
import { CREATE_COMMENT, UPDATE_COMMENT } from "@/apollo/user/mutation";
import { smallSuccess } from "@/libs/alert";
import { Message, Direction } from "@/libs/enums/common.enum";
import { NEXT_APP_API_URL } from "@/libs/config";
import { formatSeoulDateTime } from "@/libs/utils";
import type { Comment, Comments } from "@/libs/types/comment/comment";
import { CommentGroup, CommentStatus } from "@/libs/enums/comment.enum";
import { CommentInput, CommentsInquiry } from "@/libs/types/comment/comment.input";

const LIMIT_OPTIONS = [5, 10, 20, 50];

interface CommentsComponentProps {
	commentRefId: string;
	commentGroup: CommentGroup;
	initialCommentsInquiry?: CommentsInquiry;
}

const CommentsComponent = ({ commentRefId, commentGroup, initialCommentsInquiry }: CommentsComponentProps) => {
	const [isWriting, setIsWriting] = useState(false);
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [comments, setComments] = useState<Comments>({ list: [], metaCounter: [] });
	const [newCommentData, setNewCommentData] = useState<CommentInput>({
		commentGroup,
		commentContent: "",
		commentRefId,
	});
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const commentsListRef = useRef<HTMLDivElement>(null);
	const { t } = useTranslation("comments");
	const user = useReactiveVar(userVar);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(
		initialCommentsInquiry || {
			page: 1,
			limit: LIMIT_OPTIONS[0],
			sort: "createdAt",
			direction: Direction.DESC,
			search: {
				commentRefId,
				commentGroup,
			},
		},
	);

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const { data: getCommentsData, refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: "cache-and-network",
		variables: {
			input: commentInquiry,
		},
		skip: !commentInquiry.search?.commentRefId,
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (isWriting && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [isWriting]);

	useEffect(() => {
		if (getCommentsData?.getComments) {
			setComments(getCommentsData.getComments);
		}
	}, [getCommentsData]);

	const totalComments = comments.metaCounter?.[0]?.total ?? 0;

	/** HANDLERS */
	const pageChangeHandler = (newPage: number) => {
		setCommentInquiry({ ...commentInquiry, page: newPage });
		if (commentsListRef.current) {
			const header = document.querySelector("header");
			const headerHeight = header ? header.offsetHeight : 80;
			const extraSpacing = 32; // 32px
			const elementPosition = commentsListRef.current.getBoundingClientRect().top + window.pageYOffset;
			const scrollTop = Math.max(0, elementPosition - headerHeight - extraSpacing);
			window.scrollTo({ top: scrollTop, behavior: "smooth" });
		}
	};

	const editHandler = (comment: Comment) => {
		setEditingCommentId(comment._id);
		setNewCommentData({
			commentGroup,
			commentContent: comment.commentContent,
			commentRefId: comment.commentRefId,
		});
		setIsWriting(true);
	};

	const deleteHandler = async (comment: Comment) => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await updateComment({
				variables: {
					input: {
						_id: comment._id,
						commentStatus: CommentStatus.DELETE,
					},
				},
			});

			await getCommentsRefetch();
			await smallSuccess(t("comment_deleted_successfully"));
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		}
	};

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!newCommentData.commentContent.trim()) throw new Error(Message.COMMENT_CONTENT_REQUIRED);

			if (editingCommentId) {
				await updateComment({
					variables: {
						input: {
							_id: editingCommentId,
							commentContent: newCommentData.commentContent,
							commentStatus: CommentStatus.ACTIVE,
						},
					},
				});
				setEditingCommentId(null);
				await smallSuccess(t("comment_updated_successfully"));
			} else {
				await createComment({
					variables: {
						input: newCommentData,
					},
				});
				await smallSuccess(t("comment_created_successfully"));
			}

			setNewCommentData({ ...newCommentData, commentContent: "" });
			setIsWriting(false);
			await getCommentsRefetch();
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		}
	};

	const limitHandler = (newLimit: number) => {
		setCommentInquiry({ ...commentInquiry, limit: newLimit, page: 1 });
	};
	return (
		<Card className="mt-5">
			<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 sm:gap-8">
				<h3 className="text-xl font-semibold text-foreground/90">{t("comments")}</h3>
				<div className="flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-3 sm:gap-6">
					<div className="flex flex-row justify-between w-full sm:gap-6">
						<div className="flex items-center gap-2 text-muted-foreground/80">
							<MessageSquare className="h-5 w-5" />
							<span className="text-sm font-medium">
								{totalComments} {t("comments")}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground">{t("per page")}:</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="h-8 w-[70px] flex items-center justify-between">
										{commentInquiry.limit}
										<ChevronDown className="h-4 w-4 ml-1" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{LIMIT_OPTIONS.map((option) => (
										<DropdownMenuItem
											key={option}
											onClick={() => limitHandler(option)}
											className={option === commentInquiry.limit ? "bg-accent" : ""}
										>
											{option}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					{!isWriting && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setIsWriting(true);
								setEditingCommentId(null);
								setNewCommentData({
									commentGroup,
									commentContent: "",
									commentRefId,
								});
							}}
							className="w-full sm:w-auto text-muted-foreground/80 hover:text-foreground transition-colors mt-2 sm:mt-0"
						>
							<Plus className="h-4 w-4 mr-2" />
							{t("write_a_comment")}
						</Button>
					)}
				</div>
			</CardHeader>

			<CardContent>
				{isWriting && (
					<>
						<form onSubmit={submitHandler} className="mb-6">
							<div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
								<div className="w-full space-y-3">
									<Textarea
										ref={textareaRef}
										placeholder="Write a comment..."
										value={newCommentData.commentContent}
										onChange={(e) => setNewCommentData({ ...newCommentData, commentContent: e.target.value })}
										className="min-h-[100px] resize-none text-sm"
									/>
									<div className="flex justify-end space-x-3">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => {
												setNewCommentData({ ...newCommentData, commentContent: "" });
												setIsWriting(false);
												setEditingCommentId(null);
											}}
											className="text-muted-foreground/80 hover:text-foreground"
										>
											{t("cancel")}
										</Button>
										<Button type="submit" size="sm" disabled={!newCommentData.commentContent.trim()}>
											{editingCommentId ? t("update_comment") : t("post_comment")}
										</Button>
									</div>
								</div>
							</div>
						</form>
						<Separator className="mb-6" />
					</>
				)}

				{totalComments <= 0 && !isWriting ? (
					<div className="text-center py-8 sm:py-12">
						<div className="text-muted-foreground/80 mb-4 text-sm">{t("no_comments_yet")}</div>
						<Button
							variant="outline"
							onClick={() => setIsWriting(true)}
							className="text-muted-foreground/80 hover:text-foreground transition-colors"
						>
							{t("be_the_first_to_comment")}
						</Button>
					</div>
				) : (
					<div ref={commentsListRef} className="space-y-6">
						{comments.list.length > 0 &&
							comments.list
								.filter((comment) => comment._id !== editingCommentId)
								.map((comment, index) => {
									const memberImage = !!comment.memberData?.memberImage
										? `${NEXT_APP_API_URL}/${comment.memberData?.memberImage}`
										: null;
									const memberName = !!comment.memberData?.memberFullName
										? comment.memberData?.memberFullName
										: t("no_name");
									const isOwner = user?._id === comment.memberId;

									return (
										<div key={comment._id}>
											<div className="flex flex-row items-center gap-4">
												{/* Member Image */}
												<div className="flex items-center justify-center">
													<Avatar className="h-10 w-10 flex items-center justify-center">
														{memberImage ? (
															<AvatarImage src={memberImage} alt={memberName} className="rounded-full" />
														) : (
															<AvatarFallback className="bg-muted rounded-full">
																<User className="h-6 w-6 text-muted-foreground" />
															</AvatarFallback>
														)}
													</Avatar>
												</div>

												{/* Member Info and Comment Content */}
												<div className="flex-1">
													<div className="flex flex-row items-center justify-between">
														<h4 className="font-medium text-foreground/90 text-sm">{memberName}</h4>
														<div className="flex items-center justify-end">
															<span className="text-xs text-muted-foreground/80">
																{formatSeoulDateTime(comment.createdAt)}
															</span>
															{isOwner && (
																<div className="flex items-center space-x-2 ml-4">
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() => editHandler(comment)}
																		className="h-8 w-8 p-0"
																	>
																		<Pencil className="h-4 w-4 text-muted-foreground/80 hover:text-foreground" />
																	</Button>
																	<Button
																		variant="ghost"
																		size="sm"
																		onClick={() => deleteHandler(comment)}
																		className="h-8 w-8 p-0"
																	>
																		<Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" />
																	</Button>
																</div>
															)}
														</div>
													</div>

													{/* Comment Content */}
													<p className="mt-1.5 text-muted-foreground/80 text-sm">{comment.commentContent}</p>
												</div>
											</div>
											{index < comments.list.length - 1 && <Separator className="my-6" />}
										</div>
									);
								})}
						<div className="flex items-center justify-center mt-6">
							<PaginationComponent
								totalItems={totalComments}
								currentPage={commentInquiry.page}
								pageChangeHandler={pageChangeHandler}
								limit={commentInquiry.limit}
							/>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default CommentsComponent;
