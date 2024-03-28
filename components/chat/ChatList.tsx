"use client";

import { MessageType, useMessage } from "@/lib/zustand/messages";
import { useUser } from "@/lib/zustand/user";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import Message from "./Message";
import { DeleteAction, EditAction } from "./MessageActions";

export default function ChatList() {
  const {
    messages,
    addMessage,
    optimisticMessageDelete,
    optimisticMessageUpdate,
  } = useMessage();
  const { user } = useUser();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabaseBrowserClient
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            if (payload.new.send_by !== user?.id) {
              const { data, error } = await supabaseBrowserClient
                .from("users")
                .select("*")
                .eq("id", payload.new.send_by)
                .single();
              if (error) {
                toast.error(error.message);
                return;
              }
              const message = {
                ...payload.new,
                users: data,
              } as MessageType;
              addMessage(message);
            }
          } else if (payload.eventType === "DELETE") {
            optimisticMessageDelete(payload.old.id);
          } else if (payload.eventType === "UPDATE") {
            const { data, error } = await supabaseBrowserClient
              .from("users")
              .select("*")
              .eq("id", payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message);
              return;
            }
            const message = {
              ...payload.new,
              users: data,
            } as MessageType;
            optimisticMessageUpdate(message);
          }
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever only messages.length change
    scrollToBottom();
  }, [messages.length]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  return (
    <>
      <div
        className="flex-1 flex scroll-element flex-col p-5 max-w-full overflow-auto no-scrollbar scroll-smooth"
        ref={scrollContainerRef}
      >
        <DeleteAction />
        <EditAction />
        <div className="flex-1"></div>

        <div className="space-y-7">
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} />
          ))}
        </div>
      </div>
    </>
  );
}
