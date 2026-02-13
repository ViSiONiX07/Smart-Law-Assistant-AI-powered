
import "./globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"

export const metadata: Metadata = {
  title: "Law Saarthi",
  description: "AI-powered Indian legal assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0C15] text-gray-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <AuthProvider>
          <Navbar />
          <div className="pt-24">{children}</div>

          <footer className="bg-[#02040a] text-gray-500 border-t border-white/5 py-12 text-center text-sm">
            <div className="flex justify-center gap-6 mb-4 opacity-50">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            © {new Date().getFullYear()} Law Saarthi — AI Legal Companion
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}