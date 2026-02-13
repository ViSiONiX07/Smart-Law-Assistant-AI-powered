"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"

export default function SignupPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const handleSendOtp = async () => {
    if (!name || !email) {
      setError("All fields are required")
      return
    }

    if (!emailRegex.test(email)) {
      setError("Enter a valid email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setIsOtpSent(true)
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      if (res.ok) {
        login({ name, email })

        // Role based redirect for consistency
        if (email === "trix4719@gmail.com") {
          router.push("/admin")
        } else if (email === "dhananjaydagar22@gmail.com") {
          router.push("/lawyer")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(data.error || "Invalid OTP")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-10 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Get Started</h1>
        <p className="text-slate-400 text-center mb-8 text-sm">Create your account to access Law Saarthi</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!isOtpSent ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  placeholder="e.g. Rahul Verma"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 focus:outline-none transition text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
                <input
                  placeholder="name@example.com"
                  type="email"
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 focus:outline-none transition text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Enter OTP</label>
              <p className="text-xs text-slate-500 mb-2">We&apos;ve sent a 6-digit code to {email}</p>
              <input
                placeholder="000000"
                maxLength={6}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 focus:outline-none transition text-white text-center text-2xl tracking-[10px]"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={() => setIsOtpSent(false)}
                className="text-xs text-cyan-400 mt-2 hover:underline"
              >
                Change Email
              </button>
            </div>
          )}
        </div>

        <button
          onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] transition duration-200 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : isOtpSent ? "Verify & Sign Up" : "Send Verification Code"}
        </button>

        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}