"use client";
import Dialog from "@/components/custom/Dialog";
import { Button } from "@/components/ui/button";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { MessageCircle, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { Account } from "./Account";
import useSound from "use-sound";
import { UseSound as UseSoundHook } from "@/store/useSound";

export default function NavBar({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  // const [sound, setSound] = useState(false);
  const { sound, setSound } = UseSoundHook();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mouseClickSound] = useSound("/sounds/mouse-click.mp3");
  const [onSound] = useSound("/sounds/sound-on.mp3");
  const [offSound] = useSound("/sounds/sound-off.mp3");
  const { scrollY } = useScroll();

  useEffect(() => setMounted(true), []);

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
          <MessageCircle className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-gray-900 dark:text-white">
            ChatApp
          </span>
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
              <Sun className="h-5 w-5 dark:text-white" />
            ) : (
              <Moon className="h-5 w-5 text-gray-900" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {/* <Button asChild> */}
          {/* <Link href="/login">Login</Link> */}
          <Dialog trigger={false ? "LogOut" : "LogIn"}>
            <Account />
          </Dialog>
          {/* </Button> */}
        </nav>
      </motion.header>
      <div className="pt-14">{children}</div>
    </>
  );
}
