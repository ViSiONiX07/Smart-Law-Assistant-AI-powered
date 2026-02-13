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

type LawyerStatus = {
  email: string
  name: string
  isAvailable: boolean
  lastUpdated: string
}

export default function AdminPanel() {
  const { user } = useAuth()
  const router = useRouter()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [lawyerStatuses, setLawyerStatuses] = useState<LawyerStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "lawyers">("overview")
  const [bookingFilter, setBookingFilter] = useState<"pending" | "completed" | "cancelled">("pending")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Analytics
  const stats = useMemo(() => {
    const pending = bookings.filter(b => b.status === "Pending").length
    const completed = bookings.filter(b => b.status === "Completed").length
    const cancelled = bookings.filter(b => b.status === "Cancelled").length

    // Group by lawyer
    const lawyerStats = bookings.reduce((acc, booking) => {
      if (!acc[booking.lawyerName]) {
        acc[booking.lawyerName] = { total: 0, pending: 0, completed: 0 }
      }
      acc[booking.lawyerName].total++
      if (booking.status === "Pending") acc[booking.lawyerName].pending++
      if (booking.status === "Completed") acc[booking.lawyerName].completed++
      return acc
    }, {} as Record<string, { total: number; pending: number; completed: number }>)

    return {
      total: bookings.length,
      pending,
      completed,
      cancelled,
      lawyerStats
    }
  }, [bookings])

  // Filtered bookings based on status
  const filteredBookings = useMemo(() => {
    if (bookingFilter === "pending") return bookings.filter(b => b.status === "Pending")
    if (bookingFilter === "completed") return bookings.filter(b => b.status === "Completed")
    if (bookingFilter === "cancelled") return bookings.filter(b => b.status === "Cancelled")
    return bookings
  }, [bookings, bookingFilter])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    fetchBookings()
    fetchLawyerStatuses()
  }, [user, router])

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings")
      const data = await res.json()
      setBookings(data)
    } catch (err) {
      console.error("Failed to fetch bookings", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchLawyerStatuses = async () => {
    try {
      const res = await fetch("/api/lawyer-status")
      const data = await res.json()
      setLawyerStatuses(data)
    } catch (err) {
      console.error("Failed to fetch lawyer statuses", err)
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

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return

    setActionLoading(id)
    try {
      await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await fetchBookings()
    } catch (err) {
      console.error("Failed to delete booking", err)
    } finally {
      setActionLoading(null)
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
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Full site analytics and management</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "bookings"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Manage Bookings
          </button>
          <button
            onClick={() => setActiveTab("lawyers")}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === "lawyers"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            Lawyer Status
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6">
                <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-sm text-gray-300 mt-1">Total Bookings</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6">
                <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
                <div className="text-sm text-gray-300 mt-1">Pending Requests</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                <div className="text-sm text-gray-300 mt-1">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-red-600/20 to-rose-600/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6">
                <div className="text-3xl font-bold text-red-400">{stats.cancelled}</div>
                <div className="text-sm text-gray-300 mt-1">Cancelled</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-gray-300">{booking.userEmail}</span>
                        <span className="text-gray-500 mx-2">→</span>
                        <span className="text-cyan-400">{booking.lawyerName}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${booking.status === "Pending" ? "bg-yellow-600/20 text-yellow-400" :
                          booking.status === "Completed" ? "bg-green-600/20 text-green-400" :
                            "bg-red-600/20 text-red-400"
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">API Status</span>
                    <span className="flex items-center gap-2 text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Database</span>
                    <span className="flex items-center gap-2 text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Lawyers</span>
                    <span className="text-white font-semibold">{Object.keys(stats.lawyerStats).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            {/* Booking Filter Tabs */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setBookingFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${bookingFilter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setBookingFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${bookingFilter === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                Completed ({stats.completed})
              </button>
              <button
                onClick={() => setBookingFilter("cancelled")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${bookingFilter === "cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
              >
                Cancelled ({stats.cancelled})
              </button>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-gray-400">
                  No {bookingFilter} bookings found.
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-sm font-bold">
                            {booking.userEmail[0].toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold">{booking.userEmail}</h3>
                            <p className="text-sm text-gray-400">{booking.lawyerName} • {booking.specialty}</p>
                          </div>
                        </div>

                        {booking.type === "scheduled" && booking.date && (
                          <p className="text-sm text-blue-400 mt-2">
                            📅 {booking.date} • {booking.time}
                          </p>
                        )}

                        {booking.type === "instant" && (
                          <p className="text-sm text-green-400 mt-2">
                            ⚡ Instant Consultation
                          </p>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          Created {new Date(booking.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm text-center ${booking.status === "Pending" ? "bg-yellow-600/20 text-yellow-400" :
                            booking.status === "Completed" ? "bg-green-600/20 text-green-400" :
                              "bg-red-600/20 text-red-400"
                          }`}>
                          {booking.status}
                        </span>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {booking.status === "Pending" && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking._id, "Completed")}
                                disabled={actionLoading === booking._id}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition disabled:opacity-50"
                                title="Mark as Completed"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking._id, "Cancelled")}
                                disabled={actionLoading === booking._id}
                                className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded text-xs font-medium text-red-400 transition disabled:opacity-50"
                                title="Cancel"
                              >
                                ✕
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteBooking(booking._id)}
                            disabled={actionLoading === booking._id}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition disabled:opacity-50"
                            title="Delete"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Lawyer Status Tab */}
        {activeTab === "lawyers" && (
          <div className="space-y-4">
            {Object.entries(stats.lawyerStats).map(([lawyerName, data]) => {
              // Find matching lawyer status
              const lawyerStatus = lawyerStatuses.find(
                (ls) => ls.name === lawyerName || lawyerName.includes(ls.name)
              )
              const isAvailable = lawyerStatus?.isAvailable ?? true

              return (
                <div
                  key={lawyerName}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{lawyerName}</h3>
                      <p className="text-sm text-gray-400">Legal Professional</p>
                      {lawyerStatus && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(lawyerStatus.lastUpdated).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <span className={`flex items-center gap-2 text-sm ${isAvailable ? "text-green-400" : "text-gray-400"
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-400 animate-pulse" : "bg-gray-400"
                        }`}></span>
                      {isAvailable ? "Available" : "Not Available"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-2xl font-bold text-white">{data.total}</div>
                      <div className="text-xs text-gray-400 mt-1">Total Bookings</div>
                    </div>
                    <div className="bg-yellow-600/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-yellow-400">{data.pending}</div>
                      <div className="text-xs text-gray-400 mt-1">Pending</div>
                    </div>
                    <div className="bg-green-600/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-400">{data.completed}</div>
                      <div className="text-xs text-gray-400 mt-1">Completed</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
