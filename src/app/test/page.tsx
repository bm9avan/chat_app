import { fetchHelperForRedis } from "@/lib/redis";
import React from "react";

const page = async () => {
  //   const [friend, setFriend] = useState<User | null | undefined>(null);
  const me = "6385169c-fcb5-48e5-b2df-bd4dfeb89ad3";
  const friend_id = "fa7ed40f-7fdb-402b-832d-9d70b6a9f230";
  //   useEffect(() => {
  //     async function fetchFriend() {
  console.log("s realyyy called");

  const friendDetails = await fetchHelperForRedis("get", `user:${friend_id}`);
  const friend = (await JSON.parse(friendDetails)) as User;
  //   const friendResponce = (await JSON.parse(friendDetails)) as User;
  // if (friendResponce) {
  //   const chart = await fetchHelperForRedis(
  //     "smembers",
  //     `chat:${chatIdGenerater(friend_id, my_id)}`
  //   );
  // }
  //       if (friendResponce) setFriend(friendResponce);
  //       else setFriend(undefined);
  //     }
  //     if (typeof friend_id === "string" && friend_id.length > 0) {
  //       // setFriend(params.friends?.find((user) => user.id === friend_id));
  //       console.log("s its called");
  //       fetchFriend();
  //     } else setFriend(undefined);
  //   }, []);
  if (friend === null || friend === undefined) return <div>wait</div>;
  return <div>{JSON.stringify(friend)}</div>;
};

export default page;
