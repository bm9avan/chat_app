import BackChat from "@/components/custom/chat/BackChat";
import MessageList from "@/components/custom/chat/MessageList";
import TypingBar from "@/components/custom/chat/TypingBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "@/lib/auth";
import chatUniqueId from "@/lib/chatUniqueId";
import { fetchHelperForRedis } from "@/lib/redis";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { getServerSession, User } from "next-auth";

const page = async ({ params }: { params: { friend_id: string } }) => {
  const { friend_id } = params;
  const session = await getServerSession(authOptions);
  const my_id = session ? session.user.id : null;
  const friendResponce = await fetchHelperForRedis("get", `user:${friend_id}`);
  const friendDetails = (await JSON.parse(friendResponce)) as User;
  let parsedMessages = undefined;
  if (friendDetails && typeof friend_id === "string" && my_id !== null) {
    const unParsedmessages = await fetchHelperForRedis(
      "zrange",
      `chat:${chatUniqueId(friend_id, my_id)}`,
      0,
      -1
    );
    parsedMessages = unParsedmessages.map(
      (message: string) => JSON.parse(message) as Message
    );
  }
  if (parsedMessages === undefined)
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
      <header className="flex items-center justify-between p-0 border-b">
        <div className="flex justify-center items-center">
          <Avatar className=" dark:border-red-100 border-black border-2 mx-4">
            <AvatarImage
              referrerPolicy="no-referrer"
              src={friendDetails.image ? friendDetails.image : ""}
              className="w-10 h-10 object-cover rounded-full"
            />
            <AvatarFallback>
              {friendDetails.name
                ? friendDetails.name.slice(0, 2).toUpperCase()
                : "-_-"}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <div className="font-bold dark:text-red-100 text-black pr-2">
              {friendDetails.name && friendDetails.name.toUpperCase()}
            </div>
            <div className="dark:text-gray-300 text-gray-600">
              {friendDetails && friendDetails.email}
            </div>
          </div>
        </div>
        <BackChat />
      </header>
      <div
        className={cn(
          "w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
        )}
      >
        {parsedMessages && session ? (
          <MessageList
            messages={parsedMessages.reverse()}
            friend={friendDetails}
            me={session?.user}
          />
        ) : (
          <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col items-center justify-center">
            <Loader2 className="animate-spin flex justify-center align-middle" />
          </div>
        )}
        <TypingBar />
      </div>
    </div>
  );
};

export default page;
