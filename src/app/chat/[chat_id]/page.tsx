"use client";
import { Button } from "@/components/ui/button";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { CircleX, Loader2, MessageCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USERS, type User } from "@/db/dummyData";
import TypingBar from "@/components/custom/chat/TypingBar";
import MessageList from "@/components/custom/chat/MessageList";
import { cn } from "@/lib/utils";

const page = () => {
  const route = useRouter();
  const [friend, setFriend] = useState<User | null | undefined>(null);
  const { chat_id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (typeof chat_id === "string") {
      setFriend(USERS.find((user) => user.id === chat_id.split("-")[1]));
    } else setFriend(undefined);
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  if (!mounted) return null;
  if (friend === undefined)
    return (
      <div className="flex justify-center items-center h-full w-full px-10">
        <div className="flex flex-col justify-center items-center gap-4">
          <p
            className="text-muted-foreground text-center text-red-700 md:text-5xl
          "
          >
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
              src={friend ? friend.image : "/user-placeholder.png"}
              className="w-10 h-10 object-cover rounded-full"
            />
            <AvatarFallback>
              {friend ? friend.name.slice(0, 2).toUpperCase() : "BM"}
            </AvatarFallback>
          </Avatar>
          <div className="font-bold dark:text-red-100 text-black pr-2">
            {friend && friend.name.toUpperCase()}
          </div>
          <div className="dark:text-gray-300 text-gray-600">
            {friend && `( ${friend.email} )`}
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
        {friend ? (
          <MessageList />
        ) : (
          <Loader2 className="animate-spin w-lvw flex justify-center align-middle" />
        )}
        {/* <div className="w-full h-full flex flex-col justify-between"></div> */}
        <TypingBar />
      </div>
    </div>
  );
};

export default page;
