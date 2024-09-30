"use client";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const BackChat = () => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="right-20"
      onClick={() => router.push("/chat")}
    >
      <CircleX />
    </Button>
  );
};

export default BackChat;
