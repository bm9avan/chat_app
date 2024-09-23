import ChatLayout from "@/components/custom/chat/ChatLayout";
import { cookies } from "next/headers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies_current_position = cookies().get("cookies_current_position");
  const position: number[] | undefined = cookies_current_position
    ? JSON.parse(cookies_current_position.value)
    : undefined;
  return (
    <div className="border-t-2 h-[calc(100vh-4rem)]">
      <ChatLayout position={position}>{children}</ChatLayout>
    </div>
  );
}
