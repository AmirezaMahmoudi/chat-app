import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./ChatInput";
import MessageSkeleton from "./MessageSkeleton";
import { formatMessageTime } from "../lib/formatTime";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser?._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              {message.senderId === authUser?._id ? (
                authUser?.profilePic ? (
                  <div className="avatar w-10 rounded-full">
                    <img
                      src={authUser.profilePic}
                      alt={authUser.fullname}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="avatar avatar-placeholder w-10 rounded-full">
                    <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                      <span>{getInitials(authUser.fullname)}</span>
                    </div>
                  </div>
                )
              ) : selectedUser.profilePic ? (
                <div className="avatar w-10 rounded-full">
                  <img
                    src={selectedUser.profilePic}
                    alt={selectedUser.fullname}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="avatar avatar-placeholder w-10 rounded-full">
                  <div className="bg-neutral text-neutral-content w-10 h-10 rounded-full flex items-center justify-center">
                    <span>{getInitials(selectedUser.fullname)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === authUser?._id ? "chat-bubble-primary" : ""
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
