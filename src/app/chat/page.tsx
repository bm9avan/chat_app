import Friend from "@/components/custom/chat/Friend";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
  const currentUser = await getServerSession(authOptions);
  return (
    <div className="flex justify-center items-center h-full w-full px-10">
      <div className="flex flex-col justify-center text-center items-center gap-4">
        <p className="text-muted-foreground text-center">
          Click on a chat to view the messages
        </p>
        {currentUser ? <Friend me={currentUser?.user} /> : <></>}
      </div>
    </div>
  );
};

export default page;
