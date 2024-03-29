"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMessage } from "@/lib/zustand/messages";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function DeleteAction() {
  const { actionMessage, messages, optimisticMessageDelete } = useMessage();

  const handleDeleteMessage = async () => {
    // Delete from local
    optimisticMessageDelete(actionMessage?.id);

    // Delete from supabase
    const { error } = await supabaseBrowserClient
      .from("messages")
      .delete()
      .eq("id", actionMessage!.id);
    if (error) {
      toast.error(error.message);
    }
    toast.success("Message deleted successfully!");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id="trigger-delete" className="hidden"></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            you&apos;re about to delete the message.
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col">
          <AlertDialogAction onClick={handleDeleteMessage}>
            Delete
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function EditAction() {
  const { actionMessage, optimisticMessageUpdate } = useMessage();
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message?.trim().length || actionMessage?.message === message) return;
    setIsUpdating(true);

    // Update message in local
    optimisticMessageUpdate({ ...actionMessage!, message });

    // Update message in supabase
    const { error } = await supabaseBrowserClient
      .from("messages")
      .update({
        is_edit: true,
        message,
      })
      .eq("id", actionMessage!.id);

    if (error) {
      toast.error(error.message);
      setIsUpdating(false);
    }

    toast.success("Message Updated Successfully!");
    document.getElementById("trigger-edit")?.click();
    setMessage("");
    setTimeout(() => {
      setIsUpdating(false);
    }, 200);
  };

  return (
    <>
      <Dialog
        onOpenChange={() => {
          setMessage(actionMessage?.message!);
        }}
      >
        <DialogTrigger asChild>
          <button id="trigger-edit"></button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Edit message</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateMessage}>
            <div className="flex flex-col items-center gap-4 py-4">
              <Input
                id="name"
                value={message}
                placeholder={actionMessage?.message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  !message?.trim().length ||
                  isUpdating ||
                  actionMessage?.message === message
                }
                className="w-full"
              >
                {isUpdating ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
