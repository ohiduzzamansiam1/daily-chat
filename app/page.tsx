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

          {/* If user is not logged in, show the text */}
          {!user && (
            <>
              <div className="flex-1 text-center flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold">Welcome to Daily Chat</h1>
                <p className="mt-4 max-w-md">
                  This is a chat application that power by supabase realtime db.
                  Login to send message
                </p>
              </div>
            </>
          )}

          {user && (
            <>
              <ChatMessages />

              <div className="p-5">
                <ChatInput />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
