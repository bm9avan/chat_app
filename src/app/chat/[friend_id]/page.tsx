"use client";
import MessageList from "@/components/custom/chat/MessageList";
import TypingBar from "@/components/custom/chat/TypingBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CircleX, Loader2 } from "lucide-react";
import { User } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const route = useRouter();
  const [chat, setChat] = useState<
    { friend: User; me: User; messages: Message[] } | null | undefined
  >(null);
  const { friend_id } = useParams();
  // let urlId = url_id;
  // if (typeof url_id === "string") {
  //   urlId = url_id.split("--");
  // }
  // const my_id = urlId[0];
  // const friend_id = urlId[1];
  // console.log("ids", my_id, friend_id, my_id.length, friend_id.length);
  // console.log("details", "friendDetails", chatIdGenerater(friend_id, my_id));

  console.log("chare is", friend_id, chat, `user:${friend_id}`);
  // const [isScrolled, setIsScrolled] = useState(false);
  // const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    async function fetch_friendNchart() {
      console.log("s realyyy called");
      const responce = await fetch("/api/userChat", {
        method: "POST",
        body: JSON.stringify({ friendId: friend_id }),
      });
      console.log("before json ", responce);
      const unParsedData = await responce.json();
      const parsedData = (await JSON.parse(unParsedData)) as {
        me: User;
        friend: User;
        messages: Message[];
      };

      // const friendDetails = await fetchHelperForRedis(
      //   "get",
      //   `user:${friend_id}`
      // );
      // const friendResponce = (await JSON.parse(friendDetails)) as User;
      // if (friendResponce) {
      //   const chart = await fetchHelperForRedis(
      //     "smembers",
      //     `chat:${chatIdGenerater(friend_id, my_id)}`
      //   );
      // }
      if (parsedData) {
        console.log("chart dsata", parsedData);
        setChat(parsedData);
      } else setChat(undefined);
    }
    if (typeof friend_id === "string" && friend_id.length > 0) {
      // setChat(params.friends?.find((user) => user.id === friend_id));
      console.log("s its called in [id]page");
      fetch_friendNchart();
    } else {
      console.log("is it else in [id]page");
      setChat(undefined);
    }
    setMounted(true);
  }, []);

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   setIsScrolled(latest > 0);
  // });

  if (!mounted) return null;
  if (chat === undefined)
    return (
      <div className="flex justify-center items-center h-full w-full px-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-muted-foreground text-center text-red-700 md:text-5xl">
            Invalid URL
          </p>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <motion.header
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "just" }}
        className="flex items-center justify-between p-0 border-b"
      >
        <div className="flex justify-center items-center">
          <Avatar className=" dark:border-red-100 border-black border-2 mx-8">
            <AvatarImage
              referrerPolicy="no-referrer"
              src={
                chat?.friend.image ? chat.friend.image : "/user-placeholder.png"
              }
              className="w-10 h-10 object-cover rounded-full"
            />
            <AvatarFallback>
              {chat?.friend.name
                ? chat.friend.name.slice(0, 2).toUpperCase()
                : "-_-"}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <div className="font-bold dark:text-red-100 text-black pr-2">
              {chat?.friend.name && chat.friend.name.toUpperCase()}
            </div>
            <div className="dark:text-gray-300 text-gray-600">
              {chat && chat.friend.email}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="right-20"
          onClick={() => route.push("/chat")}
        >
          <CircleX />
        </Button>
      </motion.header>
      <div
        className={cn(
          "w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
        )}
      >
        {chat ? (
          <MessageList
            messages={chat.messages}
            friend={chat.friend}
            me={chat.me}
          />
        ) : (
          <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin flex justify-center align-middle" />
          </div>
        )}
        {/* <div className="w-full h-full flex flex-col justify-between"></div> */}
        <TypingBar />
      </div>
    </div>
  );
};

export default page;
