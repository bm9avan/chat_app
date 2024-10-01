"use client";

import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface AcceptRequestProps {
  requests: User[];
  setRequests: Function;
  isLoading: boolean;
}

const AcceptRequest = ({
  requests,
  setRequests,
  isLoading,
}: AcceptRequestProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const route = useRouter();
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
        setRequests((prev: User[]) =>
          prev.filter((request) => request.id !== friendId)
        );
      }
      route.refresh();
    } catch (error) {
      toast.error("An error occurred while accepting the request.");
    } finally {
      setLoading(null);
    }
  };
  const handleDeny = async (
    friendEmail: string | null | undefined,
    friendId: string
  ) => {
    if (typeof friendEmail !== "string" || !friendEmail) {
      toast.error("Email is required");
      return;
    }

    setLoading(friendId);
    try {
      const res = await fetch("/api/denyRequest", {
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
        setRequests((prev: User[]) =>
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
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        requests.map((user) => (
          <div key={user.id} className="flex justify-between items-center">
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
              onClick={() => handleDeny(user.email, user.id)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 text-center grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X />
            </Button>
          </div>
        ))
      )}
      {!isLoading && requests.length === 0 && (
        <div className="text-black dark:text-white text-xl">
          No Friend Request
        </div>
      )}
    </div>
  );
};

export default AcceptRequest;
