/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { cn } from "@/lib/utils";
import { useMessage } from "@/lib/zustand/messages";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { DeleteAction, EditAction } from "./MessageActions";

export default function ChatList() {
  const { messages } = useMessage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        setShowScrollButton(scrollTop < scrollHeight - clientHeight);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom();
    }
  }, [messages.length]);

  return (
    <>
      <div
        className="flex-1 flex flex-col scroll-element p-5 overflow-y-auto no-scrollbar scroll-smooth"
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
        <div
          className={cn(
            "absolute bottom-36 right-1/2 opacity-0 transition-all duration-300",
            showScrollButton && "opacity-100"
          )}
        >
          <div
            onClick={scrollToBottom}
            className="bg-primary transition-all duration-500 hover:scale-[1.1] grid cursor-pointer place-content-center rounded-full size-10 mx-auto shadow-2xl shadow-primary"
          >
            <ArrowDown size={18} />
          </div>
        </div>
      </div>
    </>
  );
}
