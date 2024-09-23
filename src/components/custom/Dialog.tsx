import React, { type PropsWithChildren } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

type Props = PropsWithChildren<{ trigger: string }>;

const Dialog = ({ trigger, children }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button onClick={() => console.log("object")}>{trigger}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>{children}</AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Dialog;
