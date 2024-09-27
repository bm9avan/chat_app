"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { User } from "next-auth";
import { useState } from "react";
import toast from "react-hot-toast";

interface AcceptRequestProps {
  propsRequests: User[];
}

const AcceptRequest = ({ propsRequests }: AcceptRequestProps) => {
  const [requests, setRequests] = useState(propsRequests);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAccept = async (
    friendEmail: string | null | undefined,
    friendId: string
  ) => {
    if (typeof friendEmail !== "string" || !friendEmail) {
      toast.error("Email is required");
      return;
    }

    setLoading(friendId);
    try {
      const res = await fetch("/api/acceptRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendEmail, friendId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data);
      } else {
        toast.success(data);
        setRequests((prev) =>
          prev.filter((request) => request.id !== friendId)
        );
      }
    } catch (error) {
      toast.error("An error occurred while accepting the request.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {requests.map((user) => (
        <div key={user.id} className="flex justify-between">
          <div className="p-4 text-center">
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <Button
            onClick={() => handleAccept(user.email, user.id)}
            aria-label="accept friend"
            className="w-8 h-8 bg-green-600 hover:bg-green-700 grid place-items-center rounded-full transition hover:shadow-md"
          >
            <Check />
          </Button>
          <Button
            aria-label="deny friend"
            className="w-8 h-8 bg-red-600 hover:bg-red-700 text-center grid place-items-center rounded-full transition hover:shadow-md"
          >
            <X />
          </Button>
        </div>
      ))}
      {requests.length === 0 && (
        <div className="text-black dark:text-white text-xl">
          No Friend Request
        </div>
      )}
    </div>
  );
};

export default AcceptRequest;
