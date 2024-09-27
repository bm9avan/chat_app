import { AnimatePresence, motion } from "framer-motion";
import {
  Image as ImageIcon,
  Loader,
  Loader2,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
// import { usePreferences } from "@/store/usePreferences";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { sendMessageAction } from "@/actions/message.actions";
// import { useSelectedUser } from "@/store/useSelectedUser";
// import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
// import { pusherClient } from "@/lib/pusher";
import { Message, USERS } from "@/db/dummyData";
import { Button } from "@/components/ui/button";
import { UseSound as UseSoundHook } from "@/store/useSound";
import EmojiPicker from "./EmojiPicker";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const TypingBar = () => {
  const { friend_id } = useParams();
  console.log("typeinggg", friend_id);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // const { USERS[1] } = useSelectedUser();
  // const { user: USERS[0] } = useKindeBrowserClient();

  const { sound } = UseSoundHook();
  // const queryClient = useQueryClient();

  const [imgUrl, setImgUrl] = useState("");

  const [playSound1] = useSound("/sounds/keystroke1.mp3");
  const [playSound2] = useSound("/sounds/keystroke2.mp3");
  const [playSound3] = useSound("/sounds/keystroke3.mp3");
  const [playSound4] = useSound("/sounds/keystroke4.mp3");

  const [playNotificationSound] = useSound("/sounds/notification.mp3");

  const playSoundFunctions = [playSound1, playSound2, playSound3, playSound4];

  const playRandomKeyStrokeSound = () => {
    const randomIndex = Math.floor(Math.random() * playSoundFunctions.length);
    sound && playSoundFunctions[randomIndex]();
  };

  // const { mutate: sendMessage, isPending } = useMutation({
  // mutationFn: sendMessageAction,
  // });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (typeof friend_id !== "string" || !friend_id) {
      toast.error("Friend ID is required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, friendId: friend_id }),
      });
      // sendMessage({ content: message, messageType: "text", receiverId: USERS[1]?.id! });
      console.log("bro ", res);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data);
      } else {
        toast.success(data);
        // setRequests((prev) =>
        //   prev.filter((request) => request.id !== friendId)
        // );
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while accepting the request.");
    } finally {
      setIsLoading(false);
    }
    setMessage("");

    textAreaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }

    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setMessage(message + "\n");
    }
  };

  // useEffect(() => {
  // 	const channelName = `${USERS[0]?.id}__${USERS[1]?.id}`.split("__").sort().join("__");
  // 	const channel = pusherClient?.subscribe(channelName);

  // 	const handleNewMessage = (data: { message: Message }) => {
  // 		queryClient.setQueryData(["messages", USERS[1]?.id], (oldMessages: Message[]) => {
  // 			return [...oldMessages, data.message];
  // 		});

  // 		if (sound && data.message.senderId !== USERS[0]?.id) {
  // 			playNotificationSound();
  // 		}
  // 	};

  // 	channel.bind("newMessage", handleNewMessage);

  // 	// ! Absolutely important, otherwise the event listener will be added multiple times which means you'll see the incoming new message multiple times
  // 	return () => {
  // 		channel.unbind("newMessage", handleNewMessage);
  // 		pusherClient.unsubscribe(channelName);
  // 	};
  // }, [USERS[0]?.id, USERS[1]?.id, queryClient, playNotificationSound, sound]);

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      {!message.trim() && (
        // <CldUploadWidget
        // 	signatureEndpoint={"/api/sign-cloudinary-params"}
        // 	onSuccess={(result, { widget }) => {
        // 		setImgUrl((result.info as CloudinaryUploadWidgetInfo).secure_url);
        // 		widget.close();
        // 	}}
        // >
        // 	{({ open }) => {
        // 		return (
        <ImageIcon
          size={20}
          // onClick={() => open()}
          className="cursor-pointer text-muted-foreground"
        />
        // 		);
        // 	}}
        // </CldUploadWidget>
      )}

      <Dialog open={!!imgUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center relative h-96 w-full mx-auto">
            <Image
              src={imgUrl}
              alt="Image Preview"
              fill
              className="object-contain"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              // onClick={() => {
              //   sendMessage({
              //     message: imgUrl,
              //     messageType: "image",
              //     receiverId: USERS[1]?.id!,
              //   });
              //   setImgUrl("");
              // }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        <motion.div
          layout
          key="unique-key"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
          className="w-full relative"
        >
          <Textarea
            autoComplete="off"
            placeholder="Aa"
            rows={1}
            className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden
						bg-background min-h-0"
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessage(e.target.value);
              playRandomKeyStrokeSound();
            }}
            ref={textAreaRef}
          />
          <div className="absolute right-2 bottom-0.5">
            <EmojiPicker
              onChange={(emoji) => {
                setMessage(message + emoji);
                if (textAreaRef.current) {
                  textAreaRef.current.focus();
                }
              }}
            />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            variant={"ghost"}
            size={"icon"}
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <SendHorizontal size={20} className="text-muted-foreground" />
            )}
          </Button>
        ) : (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            variant={"ghost"}
            size={"icon"}
          >
            {/* {!isPending && ( */}
            <ThumbsUp
              size={20}
              className="text-muted-foreground"
              onClick={() => {
                // sendMessage({ content: "👍", messageType: "text", receiverId: USERS[1]?.id! });
              }}
            />
            {/* )} */}
            {/* {isPending && <Loader size={20} className='animate-spin' />} */}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
};
export default TypingBar;
