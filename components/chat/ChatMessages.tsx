import InitMessages from "@/lib/zustand/InitMessage";
import { supabaseServerClient } from "@/utils/supabase/server";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import ChatList from "./ChatList";

export default async function ChatMessages() {
  const { data } = await supabaseServerClient()
    .from("messages")
    .select("*,users(*)")
    .order("created_at", { ascending: true });
  return (
    <Suspense fallback={<Loader className="animate-spin" />}>
      <ChatList />
      <InitMessages data={data || []} />
    </Suspense>
  );
}
