import { create } from "zustand";

export type MessageType = {
  created_at: string;
  id: string;
  is_edit: boolean;
  message: string;
  send_by: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
    user_name: string | null;
  } | null;
} | null;

interface Message {
  messages: MessageType[] | [];
  addMessage: (message: MessageType) => void;
  actionMessage: MessageType | null;
  setActionMessage: (message: MessageType) => void;
  optimisticMessageUpdate: (updatedMessage: MessageType) => void;
  optimisticMessageDelete: (deletedMessageId: string | undefined) => void;
}

export const useMessage = create<Message>()((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => {
      const existingMessageIndex = state.messages.findIndex(
        (msg) => msg?.id === message?.id
      );

      if (existingMessageIndex == -1) {
        // @ts-ignore
        state.messages.push(message);
      }

      return { messages: state.messages };
    }),
  actionMessage: null,
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticMessageUpdate: (updatedMessage) =>
    set((state) => ({
      messages: state.messages.filter((message) => {
        if (message?.id === updatedMessage?.id) {
          message!.is_edit = true;
          message!.message = updatedMessage?.message!;
        }
        return message;
      }),
    })),
  optimisticMessageDelete: (deletedMessageId) =>
    set((state) => ({
      messages: state.messages.filter(
        (message) => message?.id !== deletedMessageId
      ),
    })),
}));
