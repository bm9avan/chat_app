"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import chatUniqueId from "@/lib/chatUniqueId";
import { pusherClient, pusherNameHelper } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { User } from "next-auth";
import { useEffect, useRef, useState } from "react";

const MessageList = ({
  messages: dbMessages,
  me,
  friend,
}: {
  messages: Message[];
  me: User;
  friend: User;
}) => {
  const [messages, setMessages] = useState(dbMessages);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pusherClient.subscribe(
      pusherNameHelper(`chat:${chatUniqueId(me.id, friend.id)}`)
    );
    function realTimeHandler(message: Message) {
      setMessages((pr) => {
        return [message, ...pr];
      });
    }
    pusherClient.bind("incoming_friend_message", realTimeHandler);
    return () => {
      pusherClient.unbind("incoming_friend_message", realTimeHandler);
      pusherClient.unsubscribe(
        pusherNameHelper(`chat:${chatUniqueId(me.id, friend.id)}`)
      );
    };
  }, []);

  return (
    <div
      ref={messageContainerRef}
      className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col-reverse"
    >
      {messages &&
        messages?.map((message) => {
          return (
            <motion.div
              key={message.timestamp}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.senderId === me.id ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-end">
                {message.senderId === friend?.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={friend?.image || "/user-placeholder.png"}
                      alt="User Image"
                      className="border-2 border-white rounded-full"
                    />
                    <AvatarFallback>
                      {friend.name
                        ? friend.name.slice(0, 2).toUpperCase()
                        : "-_-"}
                    </AvatarFallback>
                  </Avatar>
                )}
                {typeof message.message === "string" ? (
                  <span className="bg-accent p-3 rounded-md max-w-xs">
                    {message.message}
                  </span>
                ) : (
                  <img
                    src={message.message}
                    alt="Message Image"
                    className="border p-2 rounded h-40 md:h-52 object-cover"
                  />
                )}

                {message.senderId === me?.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={me?.image || "/user-placeholder.png"}
                      alt="User Image"
                      className="border-2 border-white rounded-full"
                    />
                    <AvatarFallback>
                      {friend.name
                        ? friend.name.slice(0, 2).toUpperCase()
                        : "-_-"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </motion.div>
          );
        })}
      {messages.length === 0 && (
        <p className="text-muted-foreground text-center">
          You haven&apos;t chatted yet. Say hi and start talking!
        </p>
      )}
    </div>
  );
};
export default MessageList;
