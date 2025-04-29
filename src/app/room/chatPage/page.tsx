import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChatInterface } from "@/components/ChatInterface"
import LoadingScreen from "@/components/LoadingScreen"
import { getCurrentUser } from "@/services/firebase/auth"

export default function ChatPage() {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigate("/login")
      return
    }
    setLoading(false)
  }, [navigate])

  if (loading) {
    return <LoadingScreen />
  }

  return <ChatInterface />
}
