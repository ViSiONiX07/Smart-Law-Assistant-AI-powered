"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function AuthModal() {
    const { isLoginModalOpen, closeLoginModal, login } = useAuth()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [otp, setOtp] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isLoginModalOpen) {
                closeLoginModal()
            }
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [isLoginModalOpen, closeLoginModal])

    if (!isLoginModalOpen) return null

    const handleSendOtp = async () => {
        if (!name || !email) {
            setError("All fields are required")
            return
        }
        if (!email.includes("@")) {
            setError("Enter a valid email")
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
            if (res.ok) {
                setIsOtpSent(true)
            } else {
                const data = await res.json()
                setError(data.error || "Failed to send OTP")
            }
        } catch (err) {
            setError("Failed to send code. Try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp) {
            setError("Enter the code")
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
            if (res.ok) {
                login({ name, email })
                closeLoginModal()

                if (email === "dhananjaydagar22@gmail.com") {
                    router.push("/lawyer")
                } else if (email === "trix4719@gmail.com") {
                    router.push("/admin")
                }
            } else {
                const data = await res.json()
                setError(data.error || "Invalid code")
            }
        } catch (err) {
            setError("Verification failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0B0C15] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">

                <button
                    onClick={closeLoginModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Login Required
                </h2>
                <p className="text-gray-400 text-center mb-8 text-sm">
                    Please sign in to access this feature.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {!isOtpSent ? (
                        <>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Full Name</label>
                                <input
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition"
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Email Address</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider text-center">Enter Verification Code</label>
                            <p className="text-xs text-gray-500 text-center mb-4">Code sent to {email}</p>
                            <input
                                autoFocus
                                value={otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-3xl tracking-[12px] focus:outline-none focus:border-cyan-500/50 transition"
                                placeholder="000000"
                            />
                            <button
                                onClick={() => setIsOtpSent(false)}
                                className="w-full text-xs text-cyan-400 mt-4 hover:underline"
                            >
                                Change Email
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={isOtpSent ? handleVerifyOtp : handleSendOtp}
                    disabled={loading}
                    className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition disabled:opacity-50"
                >
                    {loading ? "Processing..." : isOtpSent ? "Verify & Continue" : "Send Code"}
                </button>

                <p className="text-center mt-6 text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => { closeLoginModal(); router.push("/signup"); }} className="text-cyan-400 hover:underline">
                        Get Started
                    </button>
                </p>

            </div>
        </div>
    )
}
