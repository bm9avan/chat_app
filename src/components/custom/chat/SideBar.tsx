"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { pusherClient, pusherNameHelper } from "@/lib/pusher";
import { UseSound as UseSoundHook } from "@/store/useSound";
import { User } from "next-auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import useSound from "use-sound";

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
    pusherClient.subscribe(pusherNameHelper(`chat:${me.id}:friend`));
    function realTimeHandler1(message: {
      senderId: string;
      message: string;
      timestamp: number;
      chatId: string;
      senderImg: string;
      senderName: string;
    }) {
      if (parms?.friend_id !== message.senderId) {
        if (message.chatId) {
          setUnSeenMessages((prev) => [...prev, message]);
        }
      }
    }
    pusherClient.bind("new_message", realTimeHandler1);
    return () => {
      pusherClient.unbind("new_message", realTimeHandler1);
      pusherClient.unsubscribe(pusherNameHelper(`chat:${me.id}}:friend`));
    };
  }, [parms]);

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
            return (
              <div className="flex flex-row" key={user.id}>
                <Button
                  onClick={() => {
                    // setSelcted(user.id);
                    if (sound) {
                      mouseClickSound();
                    }
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
            <div className="md:m-2">No Friends</div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SideBar;
