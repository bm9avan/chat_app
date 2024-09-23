"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-800"
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © 2024 ChatApp Inc. All rights reserved.{" "}
        <a href="https://github.com/bm9avan" className="underline">
          @bm9avan
        </a>
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
          href="#"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4 text-gray-500 dark:text-gray-400"
          href="#"
        >
          Privacy
        </Link>
      </nav>
    </motion.footer>
  );
};

export default Footer;
