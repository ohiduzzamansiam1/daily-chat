import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import InitUser from "@/lib/zustand/InitUser";
import { supabaseServerClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const {
    data: { user },
  } = await supabaseServerClient().auth.getUser();

  return (
    <>
      {/* Initialize global user here */}
      <InitUser user={user} />

      <div className="max-w-3xl h-dvh mx-auto md:py-10">
        <div className="h-full border rounded-md shadow-2xl shadow-primary/10 flex flex-col">
          <ChatHeader user={user} />

          <ChatMessages />

          <div className="p-5">
            <ChatInput />
          </div>
        </div>
      </div>
    </>
  );
}
