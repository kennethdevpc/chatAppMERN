import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
// import { io } from 'socket.io-client';

//const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/';

interface AuthStore {
  authUser: {
    _id: string;
    fullName: string;
    email: string;
    profilePic: string;
    createdAt: string;
  } | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[]; //----para saber que usuarios estan online
  // socket: ReturnType<typeof io> | null;
  checkAuth: () => Promise<void>;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    fullName?: string;
    email?: string;
    password?: string;
    profilePic: string;
  }) => Promise<void>;
  // connectSocket: () => void;
  // disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  // socket: null,

  checkAuth: async () => {
    try {
      //-----uso de axiosInstance para hacer peticiones al servidor, se usa asi porque ya se configuro el baseURL en el archivo axios.js
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
      //  get().connectSocket();
    } catch (error) {
      console.log('Error in checkAuth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully');
      // get().connectSocket();
    } catch (error) {
      //  toast.error(error.response.data.message);
      toast.error((error as Error).message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');

      // get().connectSocket();
    } catch (error) {
      // toast.error(error.response.data.message);
      toast.error((error as Error).message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      // get().disconnectSocket();
    } catch (error) {
      toast.error((error as Error).message);
      // toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      console.log('res.data:', res.data);
      set({ authUser: res.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.log('error in update profile:', error);
      // toast.error(error.response.data.message);
      // toast.error((error as Error).message);
      if (error instanceof Error && 'errors' in error) {
        console.log('Invalid data', error.message);
      } else {
        console.log('unknowlage error', error);
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // connectSocket: () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.connected) return;

  //   const socket = io(BASE_URL, {
  //     query: {
  //       userId: authUser._id,
  //     },
  //   });
  //   socket.connect();

  //   set({ socket: socket });

  //   socket.on('getOnlineUsers', (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });
  // },
  // disconnectSocket: () => {
  //   if (get().socket?.connected) get().socket.disconnect();
  // },
}));
