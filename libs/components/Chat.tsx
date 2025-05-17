import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Send, X, MessageSquare, User } from 'lucide-react';

import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '@/apollo/store';
import { REACT_APP_API_URL } from '@/libs/config';

import { Badge } from '@/libs/components/ui/badge';
import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/libs/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/libs/components/ui/card';
import { ScrollArea } from '@/libs/components/ui/scroll-area';

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
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/
	useEffect(() => {
		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
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
					setMessagesList((prev) => [...prev, newMessage]); // Use functional update to avoid stale closure
					break;
			}
		};
	}, [socket]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

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

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
		// When opening chat, scroll to bottom after a small delay
		if (!open) {
			setTimeout(() => {
				if (scrollAreaRef.current) {
					const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
					if (viewport) {
						viewport.scrollTop = viewport.scrollHeight;
					}
				}
			}, 300);
		}
	};

	const getInputMessageHandler = useCallback((e: any) => {
		const text = e.target.value;
		setMessageInput(text);
	}, []);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key === 'Enter') {
				onClickHandler();
			}
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput) smallError(Message.BAD_REQUEST);
		else {
			socket.send(JSON.stringify({ event: 'message', data: messageInput }));
			setMessageInput('');
		}
	};

	return (
		<div className="relative">
			{openButton ? (
				<Button
					variant="default"
					size="icon"
					className="fixed bottom-6 right-6 rounded-full shadow-lg z-50 animate-in fade-in-0 duration-300 h-12 w-12"
					onClick={handleOpenChat}
				>
					{open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
				</Button>
			) : null}

			<div
				className={`fixed mb-16 right-6 bottom-6 w-80 z-50 
          ${open ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-0 scale-95 opacity-0'} 
          transition-all duration-300`}
			>
				<Card className="shadow-xl border-border overflow-hidden m-0 p-0">
					{/* Chat Header */}
					<CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between space-y-0">
						<h3 className="font-medium">{t('Online Chat')}</h3>
						<Badge variant="secondary" className="ml-2">
							{onlineUsers}
						</Badge>
					</CardHeader>

					{/* Chat Content */}
					<CardContent className="p-0">
						<ScrollArea className="h-80 w-full overflow-auto" type="always" ref={scrollAreaRef}>
							<div className="space-y-4 p-4">
								<div className="flex justify-center">
									<div className="bg-muted rounded-lg px-3 py-2 text-muted-foreground text-sm">
										{t('Welcome to Live chat!')}
									</div>
								</div>

								{messagesList.map((ele: MessagePayload, index: number) => {
									const { text, memberData } = ele;

									const isCurrentUser = memberData?._id === user?._id;

									return (
										<div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'items-start space-x-2'}`}>
											{!isCurrentUser && (
												<Avatar className="h-8 w-8 border border-input flex items-center justify-center ">
													<AvatarImage
														src={`${REACT_APP_API_URL}/${memberData?.memberImage}`}
														alt={memberData?.memberFullName}
													/>
													<AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center">
														<User className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
											)}
											<div
												className={`px-3 py-2 rounded-lg text-sm max-w-xs break-words ${
													isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
												}`}
											>
												{text}
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
							type="text"
							name="message"
							value={messageInput}
							className="flex-1"
							placeholder={t('Type message')}
							onChange={getInputMessageHandler}
							onKeyDown={getKeyHandler}
						/>

						<Button
							variant="default"
							size="icon"
							className="rounded-full shadow-lg animate-in fade-in-0 duration-300"
							onClick={onClickHandler}
							disabled={!messageInput}
						>
							<Send className="h-6 w-6" />
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default Chat;
