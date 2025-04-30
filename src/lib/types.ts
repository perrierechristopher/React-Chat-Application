export interface User {
    id: string
    name: string
    email: string
    photoURL: string
    isOnline: boolean
    lastSeen: string
  }
  
  export interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    timestamp: string
    read: boolean
  }
  