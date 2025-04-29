// Mock user storage
let currentUser: {
    uid: string
    displayName: string | null
    email: string | null
    photoURL: string | null
  } | null = null
  
  // Mock auth state listeners
  const listeners: ((user: any) => void)[] = []
  
  // Sign in with email and password
  export async function signInWithEmailAndPassword(email: string, password: string) {
    // In a real app, this would call Firebase Auth
    // For demo purposes, we'll just create a mock user
    currentUser = {
      uid: "user-" + Math.random().toString(36).substring(2, 9),
      displayName: email.split("@")[0],
      email: email,
      photoURL: null,
    }
  
    // Notify listeners
    listeners.forEach((listener) => listener(currentUser))
  
    return currentUser
  }
  
  // Create user with email and password
  export async function createUserWithEmailAndPassword(email: string, password: string, name: string) {
    // In a real app, this would call Firebase Auth
    currentUser = {
      uid: "user-" + Math.random().toString(36).substring(2, 9),
      displayName: name,
      email: email,
      photoURL: null,
    }
  
    // Notify listeners
    listeners.forEach((listener) => listener(currentUser))
  
    return currentUser
  }
  
  // Sign in with Google
  export async function signInWithGoogle() {
    // In a real app, this would open Google sign-in popup
    currentUser = {
      uid: "google-" + Math.random().toString(36).substring(2, 9),
      displayName: "Google User",
      email: "google.user@example.com",
      photoURL: "/placeholder.svg?height=40&width=40",
    }
  
    // Notify listeners
    listeners.forEach((listener) => listener(currentUser))
  
    return currentUser
  }
  
  // Sign in with Facebook
  export async function signInWithFacebook() {
    // In a real app, this would open Facebook sign-in popup
    currentUser = {
      uid: "facebook-" + Math.random().toString(36).substring(2, 9),
      displayName: "Facebook User",
      email: "facebook.user@example.com",
      photoURL: "/placeholder.svg?height=40&width=40",
    }
  
    // Notify listeners
    listeners.forEach((listener) => listener(currentUser))
  
    return currentUser
  }
  
  // Sign out
  export async function signOut() {
    currentUser = null
  
    // Notify listeners
    listeners.forEach((listener) => listener(null))
  }
  
  // Get current user
  export function getCurrentUser() {
    return currentUser
  }
  
  // Auth state changed listener
  export function onAuthStateChanged(callback: (user: any) => void) {
    listeners.push(callback)
  
    // Call immediately with current state
    callback(currentUser)
  
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }
  