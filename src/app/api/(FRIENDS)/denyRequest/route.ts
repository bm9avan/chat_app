import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchHelperForRedis } from "@/lib/redis";
import { getServerSession } from "next-auth";

async function DenyFriend(req: Request) {
  const { friendEmail, friendId } = await req.json();

  if (!friendEmail || !friendId) {
    return Response.json("Invalid request: friend details is required", {
      status: 400,
    });
  }

  const currentUser = await getServerSession(authOptions);

  if (!currentUser || typeof currentUser.user.email !== "string") {
    return Response.json("Unauthorized request", { status: 401 });
  }

  const currentUserId =
    currentUser.user.id ||
    (await fetchHelperForRedis("get", `user:email:${currentUser.user.email}`));

  await db.srem(`user:${currentUserId}:incoming_friend_requests`, friendId);

  return Response.json("Friendship Rejected", { status: 201 });
}
export { DenyFriend as POST };
