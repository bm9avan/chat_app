"use client";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";

const BackChat = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="right-20 bg-white dark:bg-black"
      onClick={() => router.push("/chat")}
    >
      <CircleX />
    </Button>
  );
};

export default BackChat;
