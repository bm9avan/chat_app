"use client";

import { Account } from "@/components/custom/Account";
import Dialog from "@/components/custom/Dialog";
import Footer from "@/components/custom/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Globe, Lock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 m-auto md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 text-center md:text-left"
              >
                <h1 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900 dark:text-white">
                  Connect with your Friends at your Fingertips
                </h1>
                <p className="max-w-[600px] text-gray-500 m-auto text-center md:text-xl dark:text-gray-400">
                  Experience seamless communication with our intuitive chat
                  application. Stay connected anytime, anywhere.
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full max-w-sm m-auto text-center space-y-2"
                >
                  {true ? (
                    <Button onClick={() => router.push("/chat")}>
                      Get Started
                    </Button>
                  ) : (
                    <Dialog trigger={"Get Started"}>
                      <Account />
                    </Dialog>
                  )}
                  <p className="text-xs text-gray-500 text-center dark:text-gray-400">
                    Try us out for free, no paid plans to worry about!
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 m-auto md:px-6">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white"
            >
              Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Experience real-time messaging with zero lag.",
                },
                {
                  icon: Lock,
                  title: "Secure",
                  description:
                    "End-to-end encryption for all your conversations.",
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  description: "Connect with people from all around the world.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center"
                >
                  <feature.icon className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
