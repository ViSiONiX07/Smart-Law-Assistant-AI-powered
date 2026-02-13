"use client"

import { useEffect, useState, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

type Booking = {
  _id: string
  type: "scheduled" | "instant"
  lawyerId: string
  lawyerName: string
  specialty: string
  userEmail: string
  date?: string
  time?: string
  status: "Pending" | "Cancelled" | "Completed"
  createdAt: string
}

export default function LawyerDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)

  // Filters
  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === "Pending"),
    [bookings]
  )

  const completedBookings = useMemo(
    () => bookings.filter((b) => b.status === "Completed"),
    [bookings]
  )

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "lawyer") {
      router.push("/")
      return
    }

    fetchBookings()
    fetchStatus()
  }, [user, router])

  const fetchStatus = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/lawyer-status?email=${user.email}`)
      const data = await res.json()
      setIsAvailable(data.isAvailable)
    } catch (err) {
      console.error("Failed to fetch status", err)
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings")
      const data = await res.json()

      // Filter only bookings for "Adv. Dhananjay Dagar"
      const myBookings = data.filter(
        (b: Booking) => b.lawyerName === "Adv. Dhananjay Dagar"
      )

      setBookings(myBookings)
    } catch (err) {
      console.error("Failed to fetch bookings", err)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id: string, status: "Completed" | "Cancelled") => {
    setActionLoading(id)
    try {
      await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      await fetchBookings()
    } catch (err) {
      console.error("Failed to update booking", err)
    } finally {
      setActionLoading(null)
    }
  }

  const toggleStatus = async () => {
    if (!user) return
    setStatusLoading(true)
    try {
      await fetch("/api/lawyer-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          isAvailable: !isAvailable,
        }),
      })
      setIsAvailable(!isAvailable)
    } catch (err) {
      console.error("Failed to update status", err)
    } finally {
      setStatusLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center text-cyan-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0C15] text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Lawyer Dashboard
            </h1>
            <p className="text-gray-400">Welcome back, {user?.name}</p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Status:</span>
            <button
              onClick={toggleStatus}
              disabled={statusLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${isAvailable
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-600 hover:bg-gray-700 text-gray-300"
                } disabled:opacity-50`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-white animate-pulse" : "bg-gray-400"}`}></span>
              {statusLoading ? "Updating..." : isAvailable ? "Available" : "Not Available"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400">{pendingBookings.length}</div>
            <div className="text-sm text-gray-400 mt-1">Pending Requests</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-400">{completedBookings.length}</div>
            <div className="text-sm text-gray-400 mt-1">Completed</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white">{bookings.length}</div>
            <div className="text-sm text-gray-400 mt-1">Total Bookings</div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Pending Requests</h2>
          {pendingBookings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-gray-400">
              No pending requests at the moment.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition"
                >
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                          {booking.userEmail[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">{booking.userEmail}</h3>
                          <p className="text-sm text-gray-400">{booking.specialty}</p>
                        </div>
                      </div>

                      {booking.type === "scheduled" && (
                        <div className="flex items-center gap-2 text-sm text-blue-400 mt-3">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.date} • {booking.time}
                        </div>
                      )}

                      {booking.type === "instant" && (
                        <div className="flex items-center gap-2 text-sm text-green-400 mt-3">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Instant Consultation Request
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-3">
                        Requested {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking._id, "Completed")}
                        disabled={actionLoading === booking._id}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
                      >
                        {actionLoading === booking._id ? "..." : "Accept"}
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking._id, "Cancelled")}
                        disabled={actionLoading === booking._id}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 transition disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Completed Consultations</h2>
          {completedBookings.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-gray-400">
              No completed consultations yet.
            </div>
          ) : (
            <div className="space-y-4">
              {completedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 opacity-60"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{booking.userEmail}</h3>
                      <p className="text-sm text-gray-400">{booking.specialty}</p>
                      {booking.type === "scheduled" && (
                        <p className="text-sm text-blue-400 mt-2">
                          {booking.date} • {booking.time}
                        </p>
                      )}
                    </div>
                    <span className="text-sm px-3 py-1 rounded-full bg-green-600/20 text-green-400">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}