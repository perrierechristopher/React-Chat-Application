// This is a mock implementation of Firebase Realtime Database/Firestore
// In a real app, you would use the actual Firebase SDK

import type { Message, User } from "../../lib/types"

// Mock data storage
let users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    photoURL: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    photoURL: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    photoURL: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
]

let messages: Message[] = [
  {
    id: "msg-1",
    senderId: "user-1",
    receiverId: "user-2",
    content: "Hey Jane, how are you?",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: true,
  },
  {
    id: "msg-2",
    senderId: "user-2",
    receiverId: "user-1",
    content: "I'm good, thanks! How about you?",
    timestamp: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
    read: true,
  },
  {
    id: "msg-3",
    senderId: "user-1",
    receiverId: "user-2",
    content: "Doing well! Just working on a new project.",
    timestamp: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
    read: true,
  },
  {
    id: "msg-4",
    senderId: "user-3",
    receiverId: "user-1",
    content: "Hey, did you get my email?",
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    read: false,
  },
]

// Listeners
const userListeners: ((users: User[]) => void)[] = []
const messageListeners: ((messages: Message[]) => void)[] = []

// Subscribe to users
export function subscribeToUsers(callback: (users: User[]) => void) {
  userListeners.push(callback)

  // Call immediately with current data
  callback([...users])

  // Return unsubscribe function
  return () => {
    const index = userListeners.indexOf(callback)
    if (index > -1) {
      userListeners.splice(index, 1)
    }
  }
}

// Subscribe to messages
export function subscribeToMessages(callback: (messages: Message[]) => void) {
  messageListeners.push(callback)

  // Call immediately with current data
  callback([...messages])

  // Return unsubscribe function
  return () => {
    const index = messageListeners.indexOf(callback)
    if (index > -1) {
      messageListeners.splice(index, 1)
    }
  }
}

// Add a user
export async function addUser(user: User) {
  users = [...users, user]

  // Notify listeners
  userListeners.forEach((listener) => listener([...users]))
}

// Update user status
export async function updateUserStatus(userId: string, isOnline: boolean) {
  users = users.map((user) =>
    user.id === userId
      ? {
          ...user,
          isOnline,
          lastSeen: new Date().toISOString(),
        }
      : user,
  )

  // Notify listeners
  userListeners.forEach((listener) => listener([...users]))
}

// Send a message
export async function sendMessage(message: Message) {
  messages = [...messages, message]

  // Notify listeners
  messageListeners.forEach((listener) => listener([...messages]))
}

// Mark messages as read
export async function markMessagesAsRead(senderId: string, receiverId: string) {
  messages = messages.map((message) =>
    message.senderId === senderId && message.receiverId === receiverId ? { ...message, read: true } : message,
  )

  // Notify listeners
  messageListeners.forEach((listener) => listener([...messages]))
}
