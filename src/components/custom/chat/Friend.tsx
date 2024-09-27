import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddFriend from "./AddFriend";
import AcceptRequest from "./AcceptRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchHelperForRedis } from "@/lib/redis";

const Friend = async () => {
  const currentUser = await getServerSession(authOptions);
  const currentUserId = currentUser
    ? currentUser.user.id ||
      (await fetchHelperForRedis("get", `user:email:${currentUser.user.email}`))
    : null;
  // const friends = await fetchHelperForRedis(
  //   "smembers",
  //   `user:${currentUserId}:friends`
  // );
  // const friendsWithDetails = await Promise.all(
  //   friends.map(async (id: string) => {
  //     const friendDetails = await fetchHelperForRedis("get", `user:${id}`);
  //     return (await JSON.parse(friendDetails)) as User;
  //   })
  // );
  const requests = await fetchHelperForRedis(
    "smembers",
    `user:${currentUserId}:incoming_friend_requests`
  );
  console.log("req", requests, requests.length);
  const requestsWithDetails = await Promise.all(
    requests.map(async (id: string) => {
      const requestDetails = await fetchHelperForRedis("get", `user:${id}`);
      return (await JSON.parse(requestDetails)) as User;
    })
  );
  return (
    <Tabs defaultValue="send" className=" md:w-[400px]">
      <TabsList>
        <TabsTrigger value="send">Send Friend Requests</TabsTrigger>
        <TabsTrigger value="recived">
          Accept Friend Requests
          {requests.length > 0 ? (
            <p className="w-5 h-5 bg-[#ff6a6a] text-gray-900 dark:text-white rounded-full m-0.5 content-center">
              {requests.length}
            </p>
          ) : null}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="send">
        <AddFriend />
      </TabsContent>
      <TabsContent value="recived">
        <AcceptRequest propsRequests={requestsWithDetails} />
      </TabsContent>
    </Tabs>
  );
};

export default Friend;
