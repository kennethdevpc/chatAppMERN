import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';
type Message = {
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: string;
  _id: string;
};
type User = {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
  createdAt: string;
};
type ChatStore = {
  messages: Message[];
  users: User[];
  selectedUser: null | User;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false, //--es el loading, aqui se carga un skeleton
  isMessagesLoading: false, //--es el loading, aqui se carga un skeleton

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data });
    } catch (error) {
      // toast.error(error.response.data.message);
      toast.error((error as Error).message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      // toast.error(error.response.data.message);
      toast.error((error as Error).message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData: string) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      // toast.error(error.response.data.message);
      toast.error((error as Error).message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    // const socket = useAuthStore.getState().socket;

    // socket.on('newMessage', (newMessage) => {
    //   const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
    //   if (!isMessageSentFromSelectedUser) return;

    //   set({
    //     messages: [...get().messages, newMessage],
    //   });
    // });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
