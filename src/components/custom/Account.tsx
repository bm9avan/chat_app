"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CircleX, Loader2 } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function Account() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  async function loginWithGoogle() {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      // if (error && typeof (error.message) === "string") {
      //   setError(error.message);
      // }else
      // setError("Login with Google failed");
      toast.error("Login with Google failed");
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithGithub() {
    try {
      setIsLoading(true);
      await signIn("github");
    } catch (error) {
      // if (error && typeof (error.message) === "string") {
      //   setError(error.message);
      // }else
      // setError("Login with Google failed");
      toast.error("Login with Github failed");
    } finally {
      setIsLoading(false);
    }
  }

  if (session) {
    return (
      <Card className="w-full rounded-lg shadow-lg">
        <AlertDialogCancel className="m-0 p-0 bg-transparent border-0 flex gap-4 mr-2 ml-auto">
          <CircleX className="ml-auto" />
        </AlertDialogCancel>
        {/* Card Header */}
        <CardHeader className="flex items-center justify-center">
          <Avatar className="w-16 h-16">
            <AvatarImage
              referrerPolicy="no-referrer"
              src={session.user.image || "/user-placeholder.png"}
              alt={session.user.name === null ? "Name" : session.user.name}
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
        </CardHeader>

        {/* Card Content */}
        <CardContent className="p-4 text-center">
          <h2 className="text-lg font-semibold">{session.user.name}</h2>
          <p className="text-gray-500">{session.user.email}</p>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="p-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            <strong>Login Expires on: </strong>
            {format(new Date(session.expires), "PPpp")}
          </p>
          <Button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={() => {
              setIsLoading(true);
              signOut();
              router.push("/");
            }}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Logout"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button
            onClick={loginWithGithub}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}
            Github
          </Button>
          <Button
            onClick={loginWithGoogle}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="justify-center gap-3">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="flex-grow">
          Create account
        </AlertDialogAction>
      </CardFooter>
    </Card>
  );
}
