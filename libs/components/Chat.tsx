import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Send, X, MessageSquare, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '@/apollo/store';
import { REACT_APP_API_URL } from '@/libs/config';

import { Badge } from '@/libs/components/ui/badge';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/libs/components/ui/card';
import { ScrollArea } from '@/libs/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/libs/components/ui/tooltip';

import { Member } from '@/libs/types/member/member';
import { Message } from '@/libs/enums/common.enum';
import { smallError } from '@/libs/alert';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member | null;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member | null;
	action: string;
}

const Chat = () => {
	const { t } = useTranslation();
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/
	useEffect(() => {
		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			console.log('Websocket message', data);
			switch (data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					break;
				case 'message':
					const newMessage: MessagePayload = data;
					messagesList.push(newMessage);
					setMessagesList([...messagesList]);
					break;
			}
		};
	}, [socket, messagesList]);

	// Auto-scroll to bottom whenever messages change
	useEffect(() => {
		// Use setTimeout to ensure DOM has updated
		const scrollToBottom = () => {
			if (scrollAreaRef.current) {
				const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
				if (viewport) {
					viewport.scrollTop = viewport.scrollHeight;
				}
			}
		};

		scrollToBottom();
		// Also add a small delay to ensure content has rendered
		const timeoutId = setTimeout(scrollToBottom, 100);
		return () => clearTimeout(timeoutId);
	}, [messagesList]);

	// Focus input when chat opens
	useEffect(() => {
		if (open && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 300);
		}
	}, [open]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prev) => !prev);
	};

	const getInputMessageHandler = useCallback(
		(e: any) => {
			const text = e.target.value;
			setMessageInput(text);
		},
		[messageInput],
	);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key == 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput) smallError(Message.BAD_REQUEST);
		setIsTyping(true);
		socket.send(JSON.stringify({ event: 'message', data: messageInput }));
		setMessageInput('');
		// Simulate typing delay for better UX
		setTimeout(() => setIsTyping(false), 500);
	};

	return (
		<>
			{/* Chat toggle button */}
			<motion.div
				className="fixed bottom-6 right-6 z-50"
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="default"
								size="icon"
								className="rounded-full shadow-lg h-12 w-12"
								onClick={handleOpenChat}
								aria-label={open ? t('Close chat') : t('Open chat')}
							>
								{open ? (
									<X className="h-6 w-6" />
								) : (
									<>
										<MessageSquare className="h-6 w-6" />
										{onlineUsers > 0 && (
											<Badge
												variant="secondary"
												className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center"
											>
												{onlineUsers}
											</Badge>
										)}
									</>
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">{open ? t('Close chat') : t('Open chat')}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</motion.div>

			{/* Chat Box */}
			<AnimatePresence>
				{open && (
					<motion.div
						className="fixed right-6 bottom-24 w-80 sm:w-96 z-50"
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
					>
						<Card className="shadow-xl border overflow-hidden m-0 p-0 backdrop-blur-sm bg-card/95">
							{/* Chat Header */}
							<CardHeader className="bg-primary text-primary-foreground p-3 flex flex-row items-center justify-between space-y-0">
								<div className="flex items-center space-x-2">
									<MessageSquare className="h-5 w-5" />
									<h3 className="font-medium text-sm">{t('Online Chat')}</h3>
								</div>
								<Badge variant="secondary" className="ml-2">
									{onlineUsers} {t('online')}
								</Badge>
							</CardHeader>

							{/* Chat Content */}
							<CardContent className="p-0">
								<ScrollArea className="h-80 w-full" ref={scrollAreaRef}>
									<div className="space-y-4 p-4">
										<div className="flex justify-center">
											<div className="bg-muted rounded-lg px-3 py-2 text-muted-foreground text-xs">
												{t('Welcome to Live chat!')}
											</div>
										</div>

										{messagesList.map((message: MessagePayload, index: number) => {
											const { text, memberData } = message;
											const isCurrentUser = memberData?._id === user?._id;

											return (
												<div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'items-start space-x-2'}`}>
													{!isCurrentUser && (
														<Avatar className="h-8 w-8 border flex items-center justify-center">
															<AvatarImage
																src={`${REACT_APP_API_URL}/${memberData?.memberImage}`}
																alt={memberData?.memberFullName || t('User')}
															/>
															<AvatarFallback className="bg-muted text-muted-foreground">
																<User className="h-4 w-4" />
															</AvatarFallback>
														</Avatar>
													)}
													<div className="max-w-[75%] flex flex-col">
														{!isCurrentUser && (
															<span className="text-xs text-muted-foreground mb-1 ml-1">
																{memberData?.memberFullName || t('User')}
															</span>
														)}
														<div className="flex items-end gap-2">
															<div
																className={`px-3 py-2 rounded-2xl text-sm break-words ${
																	isCurrentUser
																		? 'bg-primary text-primary-foreground rounded-br-none'
																		: 'bg-accent text-accent-foreground rounded-bl-none'
																}`}
															>
																{text}
															</div>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</ScrollArea>
							</CardContent>

							{/* Chat Input */}
							<CardFooter className="p-3 border-t border-border flex space-x-2">
								<Input
									ref={inputRef}
									type="text"
									name="message"
									value={messageInput}
									className="flex-1 bg-background/50"
									placeholder={t('Type message')}
									onChange={getInputMessageHandler}
									onKeyDown={getKeyHandler}
								/>

								<Button
									variant="default"
									size="icon"
									className="rounded-full shadow-md transition-all duration-200 hover:scale-105"
									onClick={onClickHandler}
									disabled={!messageInput || isTyping}
								>
									{isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Chat;
