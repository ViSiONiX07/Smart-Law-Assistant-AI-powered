"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-5xl rounded-full glass px-6 py-3 flex justify-between items-center shadow-2xl bg-black/40"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition">
          Law Saarthi
        </span>
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <Link href="/" className="hover:text-cyan-400 transition hover:scale-105">Home</Link>
        <Link href="/sectors" className="hover:text-cyan-400 transition hover:scale-105">Sectors</Link>
        <Link href="/chat" className="hover:text-cyan-400 transition hover:scale-105">AI Chat</Link>
        <Link href="/lawyers" className="hover:text-cyan-400 transition hover:scale-105">Find Lawyer</Link>

        {user && user.role === "admin" && (
          <Link href="/admin" className="hover:text-purple-400 transition hover:scale-105 font-semibold">
            Admin Panel
          </Link>
        )}

        {user && user.role === "lawyer" && (
          <Link href="/lawyer" className="hover:text-green-400 transition hover:scale-105 font-semibold">
            Lawyer Dashboard
          </Link>
        )}

        {user && user.role === "user" && (
          <Link href="/dashboard" className="hover:text-cyan-400 transition hover:scale-105">Dashboard</Link>
        )}
      </div>

      {/* Right Section */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-300 font-medium">{user.name}</span>
            <button
              onClick={() => {
                logout()
                router.push("/")
              }}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="text-gray-300 hover:text-white text-sm transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </motion.nav>
  )
}