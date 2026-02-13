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

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<"current" | "history">("current")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  // =============================
  // FILTERS (Must be before early return)
  // =============================
  const currentBookings = useMemo(
    () => bookings.filter((b) => b.status === "Pending"),
    [bookings]
  )

  const historyBookings = useMemo(
    () => bookings.filter(
      (b) => b.status === "Cancelled" || b.status === "Completed"
    ),
    [bookings]
  )

  const fetchBookings = async () => {
    if (!user) return
    const res = await fetch(`/api/bookings?email=${user.email}`)
    const data = await res.json()
    setBookings(data)
  }

  // =============================
  // FETCH BOOKINGS
  // =============================
  useEffect(() => {
    // Small delay to allow AuthContext to load from localStorage
    const timeout = setTimeout(() => {
      if (!user) {
        router.push("/login")
      } else {
        setIsAuthChecking(false)
        fetchBookings()
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [user])

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0B0C15] flex items-center justify-center text-cyan-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  // =============================
  // CANCEL BOOKING (FIXED)
  // =============================
  const cancelBooking = async (id: string) => {
    setLoadingId(id)

    await fetch("/api/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "Cancelled",
      }),
    })

    await fetchBookings()
    setLoadingId(null)
  }

  // =============================
  // CARD
  // =============================
  const renderCard = (booking: Booking) => (
    <div
      key={booking._id}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6"
    >
      <div className="flex justify-between items-start gap-6">

        <div>
          <h2 className="text-lg font-semibold">
            {booking.lawyerName}
          </h2>

          <p className="text-slate-400 text-sm">
            {booking.specialty}
          </p>

          {booking.type === "scheduled" && (
            <p className="text-blue-400 text-sm mt-2">
              {booking.date} • {booking.time}
            </p>
          )}

          {booking.type === "instant" && (
            <p className="text-green-400 text-sm mt-2">
              Instant Consultation Request
            </p>
          )}

          <p className="text-xs text-slate-500 mt-2">
            Created {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <span
            className={`text-sm px-3 py-1 rounded-full ${booking.status === "Pending"
              ? "bg-yellow-600/20 text-yellow-400"
              : booking.status === "Cancelled"
                ? "bg-red-600/20 text-red-400"
                : "bg-green-600/20 text-green-400"
              }`}
          >
            {booking.status}
          </span>

          {booking.status === "Pending" && (
            <button
              onClick={() => cancelBooking(booking._id)}
              disabled={loadingId === booking._id}
              className="block mt-4 text-sm text-red-400 hover:text-red-300 transition cursor-pointer"
            >
              {loadingId === booking._id ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>

      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-24">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          My Dashboard
        </h1>

        <div className="flex gap-8 mb-10 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab("current")}
            className={`text-sm font-medium ${activeTab === "current"
              ? "text-white"
              : "text-slate-400 hover:text-white"
              }`}
          >
            Current Bookings
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`text-sm font-medium ${activeTab === "history"
              ? "text-white"
              : "text-slate-400 hover:text-white"
              }`}
          >
            History
          </button>
        </div>

        {activeTab === "current" ? (
          currentBookings.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              No active bookings.
            </div>
          ) : (
            <div className="space-y-6">
              {currentBookings.map(renderCard)}
            </div>
          )
        ) : historyBookings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            No history yet.
          </div>
        ) : (
          <div className="space-y-6">
            {historyBookings.map(renderCard)}
          </div>
        )}

      </div>
    </div>
  )
}