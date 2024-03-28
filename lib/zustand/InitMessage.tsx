"use client";

import { useEffect, useRef } from "react";
import { MessageType, useMessage } from "./messages";

export default function InitMessages({ data }: { data: MessageType[] }) {
  const initState = useRef(false);
  useEffect(() => {
    if (!initState.current) {
      useMessage.setState({ messages: data });
    }
    initState.current = true;
  }, [data]);

  return <></>;
}
