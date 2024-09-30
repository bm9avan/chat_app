"use client";
import { Button } from "@/components/ui/button";
import { USERS } from "@/db/dummyData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useParams, usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseSound as UseSoundHook } from "@/store/useSound";
import useSound from "use-sound";
import { User } from "next-auth";
import { Divide } from "lucide-react";
import { pusherClient, pusherNameHelper } from "@/lib/pusher";
import chatUniqueId from "@/lib/chatUniqueId";
import toast from "react-hot-toast";
import Link from "next/link";

interface SideBarProps {
  isCollapsed: boolean;
  me: User;
  friends: User[];
}

const SideBar: FC<SideBarProps> = ({ isCollapsed, friends, me }) => {
  const router = useRouter();
  const parms = useParams();
  const pathname = usePathname();
  const [unSeenMessages, setUnSeenMessages] = useState<Message[]>([]);
  const { sound } = UseSoundHook();
  const [mouseClickSound] = useSound("/sounds/mouse-click.mp3");

  useEffect(() => {
    console.log(parms);
    pusherClient.subscribe(pusherNameHelper(`chat:${me.id}:friend`));
    function realTimeHandler1(message: {
      senderId: string;
      message: string;
      timestamp: number;
      chatId: string;
      senderImg: string;
      senderName: string;
    }) {
      console.log(message);
      if (parms?.friend_id !== message.senderId) {
        toast(
          <Link href={`/chat/${message.senderId}`} className="flex">
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                referrerPolicy="no-referrer"
                src={message?.senderImg || "/user-placeholder.png"}
                alt="User Image"
                className="border-2 border-white rounded-full"
              />
              <AvatarFallback>
                {message.senderName
                  ? message.senderName.slice(0, 2).toUpperCase()
                  : "-_-"}
              </AvatarFallback>
            </Avatar>
            <b>{message.senderName}</b>
            <p>{message.message}</p>
          </Link>
        );
        if (message.chatId) {
          setUnSeenMessages((prev) => [...prev, message]);
        }
      }
      console.log("real time message");
    }
    pusherClient.bind("new_message", realTimeHandler1);
    pusherClient.subscribe(pusherNameHelper(`user:${me.id}:friend`));
    function realTimeHandler2({ friend }: { friend: User }) {
      console.log("friend added");
      toast(
        <p>
          <b>{friend.name}</b> Accepted your request
        </p>
      );
      router.refresh();
    }
    pusherClient.bind("friendship_established", realTimeHandler2);
    return () => {
      console.log("sorry we its time to unbind");
      pusherClient.unbind("new_message", realTimeHandler1);
      pusherClient.unsubscribe(pusherNameHelper(`chat:${me.id}}:friend`));
      console.log("sorry we its time to unbind");
      pusherClient.unbind("friendship_established", realTimeHandler2);
      pusherClient.unsubscribe(pusherNameHelper(`user:${me.id}:friend`));
    };
  }, []);

  useEffect(() => {
    if (pathname.includes("/chat")) {
      setUnSeenMessages((prev) =>
        prev.filter((message) => !pathname.includes(message.senderId))
      );
    }
  }, [pathname]);
  return (
    <div>
      <h2
        className={`text-3xl px-6 font-bold py-1 text-black dark:text-white ${
          isCollapsed ? "invisible" : "block"
        }`}
      >
        {!isCollapsed ? "Chats" : "."}
      </h2>
      <ScrollArea className="h-[85vh] rounded-md border-0 p-0">
        {friends.length > 0 ? (
          friends.sort().map((user) => {
            const unseenCount = unSeenMessages.filter(
              (mes) => mes.senderId === user.id
            );
            // console.log("is map correct", user, user.id);
            return (
              <div className="flex flex-row" key={user.id}>
                <Button
                  onClick={() => {
                    // setSelcted(user.id);
                    sound && mouseClickSound();
                    // router.push(`/chat/${user.id}`);
                    router.push(`/chat/${user.id}`);
                  }}
                  variant={"ghost"}
                  className="mx-0 md:m-1 flex-1 py-5 justify-start border-b-2 px-0 md:px-4"
                >
                  <Avatar className="mx-0 dark:border-red-100 border-black border-2 md:m-2">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger>
                          <AvatarImage
                            referrerPolicy="no-referrer"
                            src={
                              user.image !== null
                                ? user.image
                                : "/user-placeholder.png"
                            }
                            alt={"img"}
                          />
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            <p>{user.name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <AvatarFallback>
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isCollapsed ? (
                    <></>
                  ) : (
                    <div className="pl-4">
                      <p>{user.name}</p>{" "}
                      {unseenCount.length > 0 ? (
                        <p className="">{unseenCount.length}</p>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </Button>
              </div>
            );
          })
        ) : (
          <div className="flex flex-row">
            <div className="dark:border-red-100 border-black border-2 md:m-2">
              No Friends
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SideBar;
