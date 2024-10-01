import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type PropsWithChildren, type ReactNode } from "react";

type Props = PropsWithChildren<{ trigger: ReactNode }>;

const Dialog = ({ trigger, children }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="border-0">
        <AlertDialogHeader>{children}</AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Dialog;
