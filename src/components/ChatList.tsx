import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import type { Message, User } from "@/lib/types"
import { cn } from "../lib/utils"

interface ChatListProps {
  users: User[]
  activeUsers: string[]
  selectedChat: string | null
  onSelectChat: (userId: string) => void
  currentUser: User | null
  messages: Message[]
}

export function ChatList({ users, activeUsers, selectedChat, onSelectChat, currentUser, messages }: ChatListProps) {
  // Get the last message for each user
  const getLastMessage = (userId: string) => {
    if (!currentUser) return null

    return messages
      .filter(
        (msg) =>
          (msg.senderId === userId && msg.receiverId === currentUser.id) ||
          (msg.senderId === currentUser.id && msg.receiverId === userId),
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
  }

  // Get unread message count
  const getUnreadCount = (userId: string) => {
    if (!currentUser) return 0

    return messages.filter((msg) => msg.senderId === userId && msg.receiverId === currentUser.id && !msg.read).length
  }

  return (
    <div className="space-y-1 p-2">
      {users.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No contacts found</div>
      ) : (
        users.map((user) => {
          const isActive = activeUsers.includes(user.id)
          const isSelected = selectedChat === user.id
          const lastMessage = getLastMessage(user.id)
          const unreadCount = getUnreadCount(user.id)

          return (
            <Button
              key={user.id}
              variant={isSelected ? "secondary" : "ghost"}
              className={cn("w-full justify-start px-2 py-6", isSelected && "bg-secondary")}
              onClick={() => onSelectChat(user.id)}
            >
              <div className="flex items-center w-full">
                <div className="relative">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={user.photoURL || ""} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isActive && (
                    <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{user.name}</p>
                    {lastMessage && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {lastMessage ? lastMessage.content : "No messages yet"}
                    </p>
                    {unreadCount > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          )
        })
      )}
    </div>
  )
}
