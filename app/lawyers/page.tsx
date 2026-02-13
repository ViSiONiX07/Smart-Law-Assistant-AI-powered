"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

type Lawyer = {
  id: number
  name: string
  specialty: string
  image: string
  status: "Available" | "Busy"
}

const lawyers: Lawyer[] = [
  { id: 1, name: "Adv. Rajesh Sharma", specialty: "Criminal Law", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rajesh", status: "Available" },
  { id: 2, name: "Adv. Priya Mehta", specialty: "Corporate Law", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Priya", status: "Available" },
  { id: 3, name: "Adv. Amit Verma", specialty: "Civil Litigation", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amit", status: "Busy" },
  { id: 4, name: "Adv. Sneha Iyer", specialty: "Family Law", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sneha", status: "Available" },
  { id: 5, name: "Adv. Arjun Malhotra", specialty: "Cyber Law", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Arjun", status: "Available" },
  { id: 6, name: "Adv. Dhananjay Dagar", specialty: "Criminal Law", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=RealLawyer", status: "Available" },
]

export default function LawyersPage() {
  const { user, openLoginModal } = useAuth()
  const router = useRouter()
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null)

  // --- NEW AI STATES ---
  const [description, setDescription] = useState("")
  const [aiCategory, setAiCategory] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAIAnalysis = async () => {
    if (!user) {
      openLoginModal()
      return
    }
    if (!description) return
    setIsAnalyzing(true)
    try {
      console.log("Sending description to AI:", description)
      const res = await fetch("/api/classify", {
        method: "POST",
        body: JSON.stringify({ description }),
      })
      if (!res.ok) throw new Error("API Request failed")

      const data = await res.json()
      console.log("AI Response:", data)

      if (data.category) {
        setAiCategory(data.category)
      } else {
        alert("Could not classify the issue. Please try again.")
      }
    } catch (err) {
      console.error("AI Analysis failed", err)
      alert("AI Analysis failed. Please check console.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Filter lawyers based on AI result, or show all if no result
  const filteredLawyers = aiCategory
    ? lawyers.filter(l => l.specialty.toLowerCase().includes(aiCategory.toLowerCase()))
    : lawyers

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Verified Legal Experts</h1>

        {/* --- AI INTAKE SECTION --- */}
        <div className="max-w-2xl mx-auto mb-16 bg-slate-900 border border-blue-500/30 p-6 rounded-3xl shadow-xl shadow-blue-500/5">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Smart Lawyer Matcher (AI)</h3>
          <textarea
            placeholder="Describe your legal issue in simple words..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4 focus:outline-none focus:border-blue-500 transition"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="bg-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isAnalyzing ? "Analyzing Issue..." : "Find Best Match"}
            </button>
            {aiCategory && (
              <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                AI Category: <b>{aiCategory}</b>
              </span>
            )}
          </div>
        </div>

        {/* --- LAWYER LIST --- */}
        <div className="grid md:grid-cols-3 gap-10">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="bg-slate-800 border border-slate-700 rounded-3xl p-6 hover:border-blue-500/50 transition">
              <div className="flex justify-center mb-6">
                <img src={lawyer.image} className="w-28 h-28 rounded-full border-4 border-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-2">{lawyer.name}</h2>
              <p className="text-blue-400 text-center mb-4">{lawyer.specialty}</p>
              <button
                onClick={() => {
                  if (!user) {
                    openLoginModal()
                  } else {
                    setSelectedLawyer(lawyer)
                  }
                }}
                className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* Reset Search Button */}
        {aiCategory && (
          <div className="text-center mt-8">
            <button onClick={() => { setAiCategory(null); setDescription(""); }} className="text-slate-400 hover:text-white underline">
              Show all lawyers
            </button>
          </div>
        )}
      </div>

      {selectedLawyer && (
        <ProfileModal
          lawyer={selectedLawyer}
          close={() => setSelectedLawyer(null)}
        />
      )}
    </main>
  )
}

// ... ProfileModal remains exactly as you had it

function ProfileModal({ lawyer, close }: { lawyer: Lawyer; close: () => void }) {
  const { user } = useAuth()
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [loading, setLoading] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minDate = today.toISOString().split("T")[0]

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const maxDate = endOfMonth.toISOString().split("T")[0]

  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
  ]

  const isValid = selectedDate !== "" && selectedTime !== ""

  const handleScheduledBooking = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!isValid) return

    setLoading(true)

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "scheduled",
        lawyerId: lawyer.id.toString(),
        lawyerName: lawyer.name,
        specialty: lawyer.specialty,
        userEmail: user.email,
        date: selectedDate,
        time: selectedTime,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      alert("Booking failed")
      return
    }

    close()
    router.push("/dashboard")
  }

  const handleInstantBooking = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setLoading(true)

    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "instant",
        lawyerId: lawyer.id.toString(),
        lawyerName: lawyer.name,
        specialty: lawyer.specialty,
        userEmail: user.email,
      }),
    })

    setLoading(false)
    close()
    router.push("/dashboard")
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6">
      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-xl">

        <h2 className="text-2xl font-bold mb-6">{lawyer.name}</h2>

        <input
          type="date"
          min={minDate}
          max={maxDate}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white cursor-pointer"
        />

        <div className="grid grid-cols-3 gap-3 mb-8">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`py-2 rounded-lg border cursor-pointer ${selectedTime === slot
                ? "bg-blue-600 border-blue-600"
                : "bg-slate-800 border-slate-700"
                }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <button
          disabled={!isValid || loading}
          onClick={handleScheduledBooking}
          className={`w-full py-3 rounded-xl mb-4 ${isValid
            ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            : "bg-slate-700 cursor-not-allowed"
            }`}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>

        <button
          onClick={handleInstantBooking}
          className="w-full border border-green-600 py-3 rounded-xl text-green-400 hover:bg-green-600/10 cursor-pointer"
        >
          Instant Consultation
        </button>

      </div>
    </div>
  )
}