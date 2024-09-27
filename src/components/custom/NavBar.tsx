"use client";
import Dialog from "@/components/custom/Dialog";
import { Button } from "@/components/ui/button";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  Loader2,
  MessageCircle,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Account } from "./Account";
import useSound from "use-sound";
import { UseSound as UseSoundHook } from "@/store/useSound";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session, User } from "next-auth";

export default function NavBar({
  children,
  currentUser: session,
}: {
  children: ReactNode;
  currentUser: Session | null;
}) {
  const { theme, setTheme } = useTheme();
  // const [sound, setSound] = useState(false                                 );
  // const { status, data: session } = useSession();
  const { sound, setSound } = UseSoundHook();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mouseClickSound] = useSound("/sounds/mouse-click.mp3");
  const [onSound] = useSound("/sounds/sound-on.mp3");
  const [offSound] = useSound("/sounds/sound-off.mp3");
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    setTheme("dark");
  }, []);

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
          <MessageCircle className="h-6 w-6 mr-2 text-primary text-[#ff6a6a]" />
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
