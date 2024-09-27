import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { useSelectedUser } from "@/store/useSelectedUser";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { useQuery } from "@tanstack/react-query";
// import { getMessages } from "@/actions/message.actions";
import { useEffect, useRef } from "react";
import { messages, USERS } from "@/db/dummyData";
import { User } from "next-auth";
// import MessageSkeleton from "../skeletons/MessageSkeleton";

const MessageList = ({
  messages,
  me,
  friend,
}: {
  messages: Message[];
  me: User;
  friend: User;
}) => {
  //   const { selectedUser } = useSelectedUser();
  //   const { user: currentUser, isLoading: isUserLoading } =
  //     useKindeBrowserClient();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  //   const { data: messages, isLoading: isMessagesLoading } = useQuery({
  //     queryKey: ["messages", selectedUser?.id],
  //     queryFn: async () => {
  //       if (selectedUser && currentUser) {
  //         return await getMessages(selectedUser?.id, currentUser?.id);
  //       }
  //     },
  //     enabled: !!selectedUser && !!currentUser && !isUserLoading,
  //   });

  // Scroll to the bottom of the message container when new messages are added
  //   useEffect(() => {
  //     if (messageContainerRef.current) {
  //       messageContainerRef.current.scrollTop =
  //         messageContainerRef.current.scrollHeight;
  //     }
  //   }, [messages]);

  return (
    <div
      ref={messageContainerRef}
      className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col-reverse"
    >
      {/* This component ensure that an animation is applied when items are added to or removed from the list */}
      {/* <AnimatePresence> */}
      {messages &&
        messages?.map((message, i) => {
          console.log(
            i,
            "message clit hi",
            message.senderId === me.id,
            message.senderId,
            me.id
          );
          return (
            <div
              key={message.timestamp}
              // layout
              // initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              // animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              // exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              // transition={{
              //   opacity: { duration: 0.1 },
              //   layout: {
              //     type: "spring",
              //     bounce: 0.3,
              //     duration: messages.indexOf(message) * 0.05 + 0.2,
              //   },
              // }}
              // style={{
              //   originX: 0.5,
              //   originY: 0.5,
              // }}
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
                  </Avatar>
                )}
              </div>
            </div>
          );
        })}

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
