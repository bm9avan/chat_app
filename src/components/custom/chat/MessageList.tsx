"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useSelectedUser } from "@/store/useSelectedUser";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useQuery } from "@tanstack/react-query";
// import { getMessages } from "@/actions/message.actions";
import { useEffect, useRef, useState } from "react";
import { messages, USERS } from "@/db/dummyData";
import { User } from "next-auth";
import { fetchHelperForRedis } from "@/lib/redis";
import { pusherClient, pusherNameHelper } from "@/lib/pusher";
import chatUniqueId from "@/lib/chatUniqueId";
// import MessageSkeleton from "../skeletons/MessageSkeleton";

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
      console.log("real time message", message, chatUniqueId(me.id, friend.id));
      setMessages((pr) => {
        // if (pr === undefined || pr == null) return [newRequest];
        return [message, ...pr];
      });
    }
    pusherClient.bind("incoming_friend_message", realTimeHandler);
    return () => {
      console.log("sorry we its time to unbind");
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
      {/* This component ensure that an animation is applied when items are added to or removed from the list */}
      {/* <AnimatePresence> */}
      {messages &&
        messages?.map((message, i) => {
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
              <div className="flex gap-3 items-center">
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
          You haven't chatted yet. Say hi and start talking!
        </p>
      )}
      {/* {isMessagesLoading && (
          <>
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </>
        )} */}
      {/* </AnimatePresence> */}
    </div>
  );
};
export default MessageList;
