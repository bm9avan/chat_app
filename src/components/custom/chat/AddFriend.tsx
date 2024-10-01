"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";

const AddFriend = () => {
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [friendEmail, setFriendEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  async function addFriendHandler(event: FormEvent) {
    event.preventDefault();
    if (friendEmail === "") {
      toast.error("Email is required");
      return;
    }
    setIsLoading(true);
    const res = await fetch("/api/addFriend", {
      method: "POST",
      body: JSON.stringify({ friendEmail }),
    });
    const data = await res.json();
    if (res.status >= 400) {
      setResponse({ success: false, message: data });
      // toast.error(data);
    } else {
      if (res.status === 203) {
        setResponse({ success: true, message: data });
        // toast(data);
      } else toast.success(data);
      setFriendEmail("");
    }
    setIsLoading(false);
  }
  return (
    <form onSubmit={addFriendHandler} className="grid gap-2">
      <Input
        id="email"
        type="email"
        name="email"
        className="text-black dark:text-white text-xl"
        placeholder="em@example.com"
        value={friendEmail}
        onChange={(e) => {
          if (response !== null) setResponse(null);
          setFriendEmail(e.target.value);
        }}
      />
      {response && (
        <p
          className={
            response.success ? "text-black dark:text-white" : "text-red-700"
          }
        >
          {response.message}
        </p>
      )}
      <Button disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Send"}
      </Button>
    </form>
  );
};

export default AddFriend;
