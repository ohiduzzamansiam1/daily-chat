"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MessageType } from "@/lib/zustand/messages";
import { useUser } from "@/lib/zustand/user";
import MessageMenu from "./MessageMenu";

export default function Message({ msg }: { msg: MessageType }) {
  const { user } = useUser();

  return (
    <div className="flex justify-between">
      {/* Left side of the chats */}
      <div className="flex gap-x-1.5">
        <Avatar>
          <AvatarImage
            title={"@" + msg?.users?.user_name || ""}
            src={msg?.users?.avatar_url || ""}
            alt={`@${msg?.users?.user_name}`}
          />
          <AvatarFallback>
            {msg?.users?.display_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 items-start">
          <div className="flex items-center gap-x-1.5">
            <h1 className="font-semibold">{msg?.users?.display_name}</h1>
            <h1 className="text-xs text-gray-600 dark:text-gray-400 transition">
              {new Date(msg?.created_at!).toDateString()}
            </h1>
            {msg?.is_edit && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                - (edited)
              </span>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 transition">
            {msg?.message}
          </p>
        </div>
      </div>

      {/* Right side of chat only show if the message is the current user's */}
      {user?.id === msg?.users?.id && <MessageMenu message={msg} />}
    </div>
  );
}
