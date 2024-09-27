import { messages } from "@/db/dummyData";
import { authOptions } from "@/lib/auth";
import chatUniqueId from "@/lib/chatUniqueId";
import { db } from "@/lib/db";
import { fetchHelperForRedis } from "@/lib/redis";
import { getServerSession } from "next-auth";

async function UserChat(req: Request) {
  try {
    const { friendId } = await req.json();
    console.log("from res olvers", friendId);
    if (!friendId) {
      return Response.json("Invalid request: friend ID is required", {
        status: 400,
      });
    }
    console.log("friendId got", friendId);
    const currentUser = await getServerSession(authOptions);
    console.log("step3", currentUser);

    if (!currentUser || typeof currentUser.user.email !== "string") {
      return Response.json("Unauthorized request", { status: 401 });
    }
    const currentUserId =
      currentUser.user.id ||
      (await fetchHelperForRedis(
        "get",
        `user:email:${currentUser.user.email}`
      ));

    if (currentUserId === friendId) {
      return Response.json("You cannot chat with youself", {
        status: 400,
      });
    }
    const isAlreadyFriend = (await fetchHelperForRedis(
      "sismember",
      `user:${friendId}:friends`,
      currentUserId
    )) as 0 | 1;
    if (!isAlreadyFriend) {
      return Response.json("User is not your friend", { status: 203 });
    }
    console.log("current user got and friends", currentUserId, isAlreadyFriend);
    const friendDetails = (await db.get(`user:${friendId}`)) as User;
    console.log("friends details await", friendDetails.id);

    const unParsedmessages = await fetchHelperForRedis(
      "zrange",
      `chat:${chatUniqueId(currentUserId, friendId)}`,
      0,
      -1
    );
    const parsedMessages = unParsedmessages.map(
      (message: string) => JSON.parse(message) as Message
    );
    console.log("mesage got", parsedMessages);
    return Response.json(
      JSON.stringify({
        me: currentUser.user,
        friend: friendDetails,
        messages: parsedMessages.reverse(),
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("getUserDetails route error", error);
    return Response.json("Error: Invalid Request", { status: 500 });
  }
}

export { UserChat as POST };
