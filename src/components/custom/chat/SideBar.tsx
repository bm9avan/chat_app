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

import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UseSound as UseSoundHook } from "@/store/useSound";
import useSound from "use-sound";

interface SideBarProps {
  isCollapsed: boolean;
}

const SideBar: FC<SideBarProps> = ({ isCollapsed }) => {
  const router = useRouter();
  const parms= useParams()
  const { sound } = UseSoundHook();
  const [mouseClickSound] = useSound("/sounds/mouse-click.mp3");

  // const [selcted, setSelcted] = useState<string | null>();
  const users = USERS;
  const me = {
    id: "1",
    image: "/avatars/user2.png",
    name: "BM P",
    email: "bmp@gmail.com",
  };
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
        {users.map((user, i) => {
          return (
            <div className="flex flex-row">
              <Button
                onClick={() => {
                  // setSelcted(user.id);
                  sound && mouseClickSound();
                  router.push(`/chat/${me.id}-${user.id}`);
                }}
                variant={"ghost"}
                className="mx-0 md:m-1 flex-1 py-5 justify-start border-b-2 px-0 md:px-4"
              >
                <Avatar className="mx-0 dark:border-red-100 border-black border-2 md:m-2">
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <AvatarImage src={user.image} alt={"img"} />
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          <p>{user.name}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <AvatarFallback>
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isCollapsed ? <></> : <div className="pl-4">{user.name}</div>}
              </Button>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default SideBar;
