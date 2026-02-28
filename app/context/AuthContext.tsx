"use client"

import { createContext, useContext, useEffect, useState } from "react"
import AuthModal from "../components/AuthModal"

export type User = {
  name: string
  email: string
  role: "user" | "lawyer" | "admin"
}

type AuthContextType = {
  user: User | null
  login: (data: { name: string; email: string }) => void
  logout: () => void
  isLoginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored)
        setUser((prev) => (JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed))
      } catch (err) {
        console.error("Failed to parse stored user", err)
      }
    }
  }, [])

  const login = ({
    name,
    email,
  }: {
    name: string
    email: string
  }) => {
    let role: "user" | "lawyer" | "admin" = "user"

    // Role assignment based on email
    if (email === "trix4719@gmail.com") {
      role = "admin"
    } else if (email === "dhananjaydagar22@gmail.com") {
      role = "lawyer"
    }

    const newUser: User = {
      name,
      email,
      role,
    }

    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}
    >
      {children}
      <AuthModal />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}