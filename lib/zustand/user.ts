import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserStore {
  user: User | null;
}

export const useUser = create<UserStore>()((set) => ({
  user: null,
}));
