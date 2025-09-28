import { create } from "zustand";
import { Axios } from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const url =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

interface AuthStore {
  authUser: any | null;
  isSigningUp: boolean;
  isLoginingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  socket: Socket | null;
  onlineUsers: string[]; // 👈 added this

  checkAuth: () => Promise<void>;
  signup: (data: {
    fullname: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  updateProfile: (data: {
    email: string;
    password: string;
    profilePic: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoginingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [], // 👈 init here

  checkAuth: async () => {
    try {
      const response = await Axios.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await Axios.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoginingIn: true });
    try {
      const res = await Axios.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoginingIn: false });
    }
  },

  logout: async () => {
    try {
      await Axios.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await Axios.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(url, {
      query: { userId: authUser._id },
    });
    newSocket.connect();

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
