import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "./services/firebase/auth"
import LoginPage from "./app/auth/login/page"
import SignupPage from "./app/auth/signup/page"
import ChatPage from "./app/room/chatPage/page"
import LoadingScreen from "./components/LoadingScreen"
import { ThemeProvider } from "./lib/providers/theme-provider"
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="chat-theme">
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/" element={user ? <ChatPage /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
