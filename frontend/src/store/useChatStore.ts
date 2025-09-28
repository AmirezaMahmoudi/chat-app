import { create } from "zustand"
import { Axios } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"
import { Socket } from "socket.io-client"

// User interface
interface User {
  _id: string
  fullname: string
  profilePic?: string
}

// Message interface
interface Message {
  _id: string
  text: string
  senderId: string
  receiverId: string
  createdAt: string
  image?: string
}

type NewMessage = {
  text: string
  image?: string
}

// Chat store interface
interface ChatStore {
  messages: Message[]
  users: User[]
  selectedUser: User | null
  isUsersLoading: boolean
  isMessagesLoading: boolean
  getUsers: () => Promise<void>
  getMessages: (userId: string) => Promise<void>
  sendMessage: (messageData: NewMessage) => Promise<void>
  setSelectedUser: (selectedUser: User | null) => void
  subscribeToMessages: () => void
  unsubscribeFromMessages: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await Axios.get("/messages/users")
      set({ users: res.data })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users")
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true })
    try {
      const res = await Axios.get(`/messages/${userId}`)
      set({ messages: res.data })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch messages")
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (messageData: NewMessage) => {
    const { selectedUser, messages } = get()
    if (!selectedUser) return

    try {
      const res = await Axios.post(`/messages/send/${selectedUser._id}`, messageData)
      set({ messages: [...messages, res.data] })

      // Emit via socket to notify receiver
      const socket: Socket | null = useAuthStore.getState().socket
      socket?.emit("getOnlineUsers", res.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message")
    }
  },

  subscribeToMessages: () => {
    const socket: Socket | null = useAuthStore.getState().socket
    if (!socket) return

    socket.on("newMessage", (newMessage: Message) => {
      const { selectedUser, messages } = get()
      if (!selectedUser) return

      // Append only messages relevant to current chat
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set({ messages: [...messages, newMessage] })
      }
    })
  },

  unsubscribeFromMessages: () => {
    const socket: Socket | null = useAuthStore.getState().socket
    socket?.off("newMessage")
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}))
