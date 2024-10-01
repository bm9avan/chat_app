"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pusherClient, pusherNameHelper } from "@/lib/pusher";
import { fetchHelperForRedis } from "@/lib/redis";
import { User } from "next-auth";
import { useEffect, useState } from "react";
import AcceptRequest from "./AcceptRequest";
import AddFriend from "./AddFriend";

const Friend = ({ me }: { me: User }) => {
  const [requests, setRequests] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchCurrentRequest() {
      const requests = await fetchHelperForRedis(
        "smembers",
        `user:${me?.id}:incoming_friend_requests`
      );
      const requestsWithDetails = await Promise.all(
        requests.map(async (id: string) => {
          const requestDetails = await fetchHelperForRedis("get", `user:${id}`);
          return (await JSON.parse(requestDetails)) as User;
        })
      );
      setRequests(requestsWithDetails);
      setIsLoading(false);
    }
    fetchCurrentRequest();
    pusherClient.subscribe(
      pusherNameHelper(`user:${me?.id}:incoming_friend_requests`)
    );
    function realTimeHandler({ newRequest }: { newRequest: User }) {
      setRequests((pr) => {
        // if (pr === undefined || pr == null) return [newRequest];
        return [...pr, newRequest];
      });
    }
    pusherClient.bind("incoming_friend_requests", realTimeHandler);
    return () => {
      pusherClient.unbind("incoming_friend_requests", realTimeHandler);
      pusherClient.unsubscribe(
        pusherNameHelper(`user:${me?.id}:incoming_friend_requests`)
      );
    };
  }, []);

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
        <AcceptRequest
          requests={requests}
          setRequests={setRequests}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default Friend;
