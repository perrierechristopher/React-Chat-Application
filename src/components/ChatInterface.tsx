import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { UserNav } from "./UserNav"
import { ChatList } from "./ChatList"
import { getCurrentUser } from "../services/firebase/auth"
import { sendMessage, subscribeToMessages, subscribeToUsers } from "../services/firebase/database"
import type { Message, User } from "@/lib/types"
import { cn } from "../lib/utils"
import { Menu, Search, Send, Users } from "lucide-react"
import { useMobile } from "@/lib/hooks/use-mobile"

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activeUsers, setActiveUsers] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const isMobile = useMobile()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate("/login")
      return
    }

    setCurrentUser({
      id: user.uid,
      name: user.displayName || "User",
      email: user.email || "",
      photoURL: user.photoURL || "",
      isOnline: true,
      lastSeen: new Date().toISOString(),
    })

    // Subscribe to users
    const unsubscribeUsers = subscribeToUsers((updatedUsers) => {
      setUsers(updatedUsers)

      // Extract online users
      const online = updatedUsers.filter((user) => user.isOnline).map((user) => user.id)

      setActiveUsers(online)

      // Set first user as selected chat if none selected
      if (!selectedChat && updatedUsers.length > 0 && updatedUsers[0].id !== user.uid) {
        setSelectedChat(updatedUsers[0].id)
      }
    })

    // Subscribe to messages
    const unsubscribeMessages = subscribeToMessages((updatedMessages) => {
      setMessages(updatedMessages)
      scrollToBottom()
    })

    return () => {
      unsubscribeUsers()
      unsubscribeMessages()
    }
  }, [navigate])

  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false)
    } else {
      setShowSidebar(true)
    }
  }, [isMobile])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !currentUser || !selectedChat) return

    await sendMessage({
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedChat,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    })

    setNewMessage("")
  }

  const filteredUsers = users.filter(
    (user) => user.id !== currentUser?.id && user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMessages = messages
    .filter(
      (message) =>
        (message.senderId === currentUser?.id && message.receiverId === selectedChat) ||
        (message.senderId === selectedChat && message.receiverId === currentUser?.id),
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const selectedUser = users.find((user) => user.id === selectedChat)

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white dark:bg-gray-800 w-80 flex flex-col border-r transition-all duration-300 ease-in-out",
          isMobile && !showSidebar ? "w-0 -ml-80" : "w-80",
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Chats</h1>
            <UserNav />
          </div>
          <div className="mt-4 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <ChatList
            users={filteredUsers}
            activeUsers={activeUsers}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            currentUser={currentUser}
            messages={messages}
          />
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <header className="bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {selectedUser ? (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={selectedUser.photoURL || ""} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedUser.name}</h2>
                  <p className="text-xs text-muted-foreground">{selectedUser.isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
            ) : (
              <h2 className="font-semibold">Select a chat</h2>
            )}
          </div>
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Users className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Active Users: {activeUsers.length}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
          {selectedChat ? (
            filteredMessages.length > 0 ? (
              <div className="space-y-4">
                {filteredMessages.map((message) => {
                  const isCurrentUser = message.senderId === currentUser?.id
                  const sender = users.find((user) => user.id === message.senderId)

                  return (
                    <div key={message.id} className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
                      <div className="flex items-end gap-2 max-w-[70%]">
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={sender?.photoURL || ""} alt={sender?.name} />
                            <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "rounded-lg p-3",
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        {selectedChat && (
          <footer className="p-4 bg-white dark:bg-gray-800 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </footer>
        )}
      </div>
    </div>
  )
}
