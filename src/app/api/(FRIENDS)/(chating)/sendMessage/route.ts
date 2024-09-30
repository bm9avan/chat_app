import { messages } from "@/db/dummyData";
import { authOptions } from "@/lib/auth";
import chatUniqueId from "@/lib/chatUniqueId";
import { db } from "@/lib/db";
import { pusherNameHelper, pusherServer } from "@/lib/pusher";
import { fetchHelperForRedis } from "@/lib/redis";
import { getServerSession } from "next-auth";

async function SendMessage(req: Request) {
  try {
    const { friendId, message } = await req.json();
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
    console.log("friends details await", friendDetails);
    const timestamp = Date.now();
    await db.zadd(`chat:${chatUniqueId(currentUserId, friendId)}`, {
      score: timestamp,
      member: JSON.stringify({ senderId: currentUserId, message, timestamp }),
    });

    console.log("unParsedmessages id", chatUniqueId(currentUserId, friendId));
    const chatId = chatUniqueId(currentUserId, friendId);
    pusherServer.trigger(
      pusherNameHelper(`chat:${chatId}`),
      "incoming_friend_message",
      { senderId: currentUserId, message, timestamp }
    );
    pusherServer.trigger(
      pusherNameHelper(`chat:${friendId}:friend`),
      "new_message",
      {
        senderId: currentUserId,
        senderName: currentUser.user.name,
        message,
        timestamp,
        chatId,
        senderImg: currentUser.user.image,
      }
    );

    return Response.json("Message added to DB sucessfuly", {
      status: 200,
    });
  } catch (error) {
    console.log("getUserDetails route error", error);
    return Response.json("Error: Invalid Request", { status: 500 });
  }
}

export { SendMessage as POST };
