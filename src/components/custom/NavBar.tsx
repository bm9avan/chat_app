"use client";
import Dialog from "@/components/custom/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { pusherClient, pusherNameHelper } from "@/lib/pusher";
import { UseSound as UseSoundHook } from "@/store/useSound";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MessageCircle, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { Session } from "next-auth";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSound from "use-sound";
import { Account } from "./Account";

export default function NavBar({
  children,
  currentUser: session,
}: {
  children: ReactNode;
  currentUser: Session | null;
}) {
  const { theme, setTheme } = useTheme();
  const { sound, setSound } = UseSoundHook();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const parms = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [mouseClickSound] = useSound("/sounds/mouse-click.mp3");
  const [onSound] = useSound("/sounds/sound-on.mp3");
  const [offSound] = useSound("/sounds/sound-off.mp3");
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    if (!theme) setTheme("light");
    function realTimeHandler1(message: {
      senderId: string;
      message: string;
      timestamp: number;
      chatId: string;
      senderImg: string;
      senderName: string;
    }) {
      if (!pathname.includes(message.senderId)) {
        toast(
          <Link
            href={`/chat/${message.senderId}`}
            className="flex gap-2 items-center"
          >
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                referrerPolicy="no-referrer"
                src={message?.senderImg || "/user-placeholder.png"}
                alt="User Image"
                className="border-2 border-white rounded-full"
              />
              <AvatarFallback className="bg-black text-[#ff6a6a]">
                {message.senderName
                  ? message.senderName.slice(0, 2).toUpperCase()
                  : "-_-"}
              </AvatarFallback>
            </Avatar>
            <b>{message.senderName}</b>
            <p>
              {message.message.slice(0, 50)}
              {message.message.length > 50 ? "..." : ""}
            </p>
          </Link>
        );
      }
    }
    function realTimeHandler2({ friend }: { friend: User }) {
      toast(
        <p>
          <b>{friend.name}</b> Accepted your request
        </p>
      );
      router.refresh();
    }
    if (session?.user) {
      pusherClient.subscribe(
        pusherNameHelper(`chat:${session.user.id}:friend`)
      );
      pusherClient.bind("new_message", realTimeHandler1);
      pusherClient.subscribe(
        pusherNameHelper(`user:${session.user.id}:friend`)
      );
      pusherClient.bind("friendship_established", realTimeHandler2);
    }
    return () => {
      if (session?.user) {
        pusherClient.unbind("new_message", realTimeHandler1);
        pusherClient.unsubscribe(
          pusherNameHelper(`chat:${session.user.id}}:friend`)
        );
        pusherClient.unbind("friendship_established", realTimeHandler2);
        pusherClient.unsubscribe(
          pusherNameHelper(`user:${session.user.id}:friend`)
        );
      }
    };
  }, [parms, pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 0);
  });

  if (!mounted) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`px-4 lg:px-6 h-14 flex items-center fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md"
            : "bg-transparent"
        }`}
      >
        <Link className="flex items-center justify-center" href="/">
          <MessageCircle className="h-6 w-6 mr-2 text-[#ff6a6a]" />
          <span className="font-bold text-[#ff6a6a]">ChatApp</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" size="icon" onClick={() => setSound(!sound)}>
            {sound ? (
              <Volume2
                onClick={() => offSound()}
                className="h-5 w-5 text-gray-900 dark:text-white"
              />
            ) : (
              <VolumeX
                onClick={() => onSound()}
                className="h-5 w-5 text-gray-900 dark:text-white"
              />
            )}
            <span className="sr-only">Toggle sound</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              sound && mouseClickSound();
            }}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-gray-900 dark:text-white" />
            ) : (
              <Moon className="h-5 w-5 text-gray-900 dark:text-white" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {/* <Button asChild> */}
          {/* <Link href="/login">Login</Link> */}
          {session !== null ? (
            <Dialog
              trigger={
                <Avatar className="w-8 h-8 bg-transparent">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={session.user.image || "/user-placeholder.png"}
                    alt={
                      session.user.name === null ? "Name" : session.user.name
                    }
                  />
                  <AvatarFallback>
                    {(typeof session.user.name !== "string"
                      ? "Name"
                      : session.user.name
                    )
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              }
            >
              <Account />
            </Dialog>
          ) : (
            <Dialog trigger={<Button>Login</Button>}>
              <Account />
            </Dialog>
          )}
          {/* {status === "loading" ? (
            <Loader2 className="animate-spin" />
          ) : status === "authenticated" ? (
            <Dialog
              trigger={
                <Avatar className="w-8 h-8 bg-transparent">
                  <AvatarImage referrerPolicy="no-referrer"
                    src={session.user.image || "/user-placeholder.png"}
                    alt={
                      session.user.name === null ? "Name" : session.user.name
                    }
                  />
                  <AvatarFallback>
                    {(typeof session.user.name !== "string"
                      ? "Name"
                      : session.user.name
                    )
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              }
            >
              <Account />
            </Dialog>
          ) : (
            <Dialog trigger={<Button>Login</Button>}>
              <Account />
            </Dialog>
          )} */}
        </nav>
      </motion.header>
      <div className="pt-14">{children}</div>
    </>
  );
}
