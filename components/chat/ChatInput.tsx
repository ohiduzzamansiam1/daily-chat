"use client";

import { MessageType, useMessage } from "@/lib/zustand/messages";
import { useUser } from "@/lib/zustand/user";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { uuid } from "uuidv4";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const { addMessage } = useMessage();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim().length) return;

    const newMessage: MessageType = {
      id: uuid(),
      is_edit: false,
      message,
      send_by: user?.id || "",
      created_at: new Date().toISOString(),
      users: {
        id: user?.id || "",
        avatar_url: user?.user_metadata.avatar_url,
        created_at: new Date().toISOString(),
        display_name: user?.user_metadata.full_name,
        user_name: user?.user_metadata.user_name,
      },
    };

    addMessage(newMessage);
    setMessage("");

    const { error } = await supabaseBrowserClient.from("messages").insert({
      id: newMessage.id,
      message: newMessage.message,
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex items-center gap-x-3">
        <Input
          type="text"
          className="p-6"
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button className="p-6" disabled={!message.trim().length}>
          <Send />
        </Button>
      </form>
    </>
  );
}
