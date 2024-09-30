import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherNameHelper, pusherServer } from "@/lib/pusher";
import { fetchHelperForRedis } from "@/lib/redis";
import { getServerSession, User } from "next-auth";

async function AcceptFriend(req: Request) {
  const { friendEmail, friendId } = await req.json();
  // const js= await JSON.parse(req.body)
  console.log("step1", friendEmail);

  if (!friendEmail || !friendId) {
    return Response.json("Invalid request: friend details is required", {
      status: 400,
    });
  }

  const unParsedfriendDetails = (await fetchHelperForRedis(
    "get",
    `user:${friendId}`
  )) as string;
  const friendDetails = JSON.parse(unParsedfriendDetails) as User;
  console.log("step2", friendId);
  console.log(
    "why are invalid is it  not getting the user details from redis",
    friendDetails,
    friendEmail,
    friendId
  );
  if (friendDetails.email !== friendEmail) {
    return Response.json("User Details", {
      status: 404,
    });
  }
  //   if (!friendId) {
  //     return Response.json("User not found with corresponding email", {
  //       status: 404,
  //     });
  //   }

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
    (await fetchHelperForRedis("get", `user:email:${currentUser.user.email}`));
  // console.log("my id wait is", currentUserId, 0 || 1, 2 || 0, 1 || 3);
  //   const isRequestAlreadySent = (await fetchHelperForRedis(
  //     "sismember",
  //     `user:${friendId}:incoming_friend_requests`,
  //     currentUserId
  //   )) as 0 | 1;
  //   if (isRequestAlreadySent) {
  //     return Response.json("Friend request is already sent by you", {
  //       status: 200,
  //     });
  //   }
  const isRequestAlreadyRecived = (await fetchHelperForRedis(
    "sismember",
    `user:${currentUserId}:incoming_friend_requests`,
    friendId
  )) as 0 | 1;
  if (!isRequestAlreadyRecived) {
    return Response.json(
      "Can't add friend, you have not sent a friend request yet",
      {
        status: 403,
      }
    );
  }
  const isAlreadyFriend = (await fetchHelperForRedis(
    "sismember",
    `user:${friendId}:friends`,
    currentUserId
  )) as 0 | 1;
  if (isAlreadyFriend) {
    return Response.json("User is already your friend", { status: 200 });
  }

  await db.sadd(`user:${friendId}:friends`, currentUserId);
  await db.sadd(`user:${currentUserId}:friends`, friendId);
  await db.srem(`user:${currentUserId}:incoming_friend_requests`, friendId);
  console.log("YOu bort are friends now");
  pusherServer.trigger(
    pusherNameHelper(`user:${friendId}:friend`),
    "friendship_established",
    {
      friend: currentUser.user,
    }
  );
  return Response.json("Friendship established", { status: 201 });
}
export { AcceptFriend as POST };
