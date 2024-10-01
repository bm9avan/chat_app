import ChatLayout from "@/components/custom/chat/ChatLayout";
import { authOptions } from "@/lib/auth";
import { fetchHelperForRedis } from "@/lib/redis";
import { getServerSession, User } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { friends: User[] };
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = session ? session.user.id : null;
  const friends = await fetchHelperForRedis(
    "smembers",
    `user:${currentUserId}:friends`
  );
  const friendsWithDetails = await Promise.all(
    friends?.map(async (id: string) => {
      const friendDetails = await fetchHelperForRedis("get", `user:${id}`);
      return (await JSON.parse(friendDetails)) as User;
    })
  );

  params.friends = friends;
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/chat");
  }
  const cookies_current_position = cookies().get("cookies_current_position");
  const position: number[] | undefined = cookies_current_position
    ? JSON.parse(cookies_current_position.value)
    : undefined;
  return (
    <div className="border-t-2 h-[calc(100vh-4rem)]">
      <ChatLayout
        position={position}
        me={session.user}
        friends={friendsWithDetails}
      >
        {children}
      </ChatLayout>
    </div>
  );
}
