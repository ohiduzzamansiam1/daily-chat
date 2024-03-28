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
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function ChatHeader({ user }: { user: User | null }) {
  const router = useRouter();

  // TODO: Implement Github Login
  const handleGithubLogin = async () => {
    const { error } = await supabaseBrowserClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: location.origin + "/auth/callback",
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  // TODO: Implement Logout
  const handleLogout = async () => {
    const { error } = await supabaseBrowserClient.auth.signOut();

    if (error) {
      toast.error(error.message);
    }

    router.refresh();
  };

  return (
    <div className="h-20">
      <div className="p-5 px-7 border-b h-full shadow-2xl shadow-primary/10 flex items-center justify-between">
        {/* Navigation left Side */}
        <div>
          <h1 className="text-xl font-bold select-none cursor-pointer">
            Daily Chat
          </h1>
          <div className="flex items-center gap-x-2 mt-1">
            <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-sm">2 online</h1>
          </div>
        </div>

        {/* Navigation right Side */}
        <div>
          {!user ? (
            <Button onClick={handleGithubLogin}>Login</Button>
          ) : (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"}>Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You&apos;re about to logout.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
