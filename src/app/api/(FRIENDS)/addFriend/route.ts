import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchHelperForRedis } from "@/lib/redis";
import { getServerSession } from "next-auth";

async function AddFriend(req: Request) {
  try {
    const { friendEmail } = await req.json();
    console.log("step1", friendEmail);

    if (!friendEmail) {
      return Response.json("Invalid request: friend email is required", {
        status: 400,
      });
    }

    const friendId = await fetchHelperForRedis(
      "get",
      `user:email:${friendEmail}`
    );
    console.log("step2", friendId);

    if (!friendId) {
      return Response.json("User not found with corresponding email", {
        status: 404,
      });
    }

    const currentUser = await getServerSession(authOptions);
    console.log("step3", currentUser);

    if (!currentUser || typeof currentUser.user.email !== "string") {
      return Response.json("Unauthorized request", { status: 401 });
    }

    if (currentUser.user.email === friendEmail) {
      return Response.json("You cannot add yourself as a friend", {
        status: 400,
      });
    }
    const currentUserId =
      currentUser.user.id ||
      (await fetchHelperForRedis(
        "get",
        `user:email:${currentUser.user.email}`
      ));
    // console.log("my id wait is", currentUserId, 0 || 1, 2 || 0, 1 || 3);
    const isRequestAlreadySent = (await fetchHelperForRedis(
      "sismember",
      `user:${friendId}:incoming_friend_requests`,
      currentUserId
    )) as 0 | 1;
    if (isRequestAlreadySent) {
      return Response.json("Friend request is already sent by you", {
        status: 203,
      });
    }
    const isRequestAlreadyRecived = (await fetchHelperForRedis(
      "sismember",
      `user:${currentUserId}:incoming_friend_requests`,
      friendId
    )) as 0 | 1;
    if (isRequestAlreadyRecived) {
      return Response.json(
        "You have already recived a friend request from this user, accept it",
        {
          status: 203,
        }
      );
    }
    const isAlreadyFriend = (await fetchHelperForRedis(
      "sismember",
      `user:${friendId}:friends`,
      currentUserId
    )) as 0 | 1;
    if (isAlreadyFriend) {
      return Response.json("User is already your friend", { status: 203 });
    }

    await db.sadd(`user:${friendId}:incoming_friend_requests`, currentUserId);
    console.log("Friend request sent successfully");

    return Response.json("Friend request sent successfully", { status: 201 });
  } catch (error) {
    return Response.json("Error: Invalid Request", { status: 500 });
  }
}
export { AddFriend as POST };
