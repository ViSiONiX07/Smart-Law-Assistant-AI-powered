"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import { SECTORS_DATA, Sector } from "./data"

export default function SectorsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null)

  const handleSectorClick = (sector: Sector) => {
    if (!user) {
      router.push("/login")
      return
    }
    setSelectedSector(sector)
  }

  return (
    <main className="min-h-screen bg-[#0B0C15] text-white pt-24 px-6 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <AnimatePresence mode="wait">
          {!selectedSector ? (
            /* LIST VIEW */
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Legal Sectors
              </h1>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Select a category to explore key laws, acts, and legal frameworks governing that sector.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECTORS_DATA.map((sector, i) => (
                  <motion.div
                    key={sector.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleSectorClick(sector)}
                    className="group cursor-pointer relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-5 rounded-2xl transition duration-500`}></div>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl">{sector.icon}</span>
                      <h2 className="text-xl font-bold text-gray-100 group-hover:text-cyan-400 transition">
                        {sector.title}
                      </h2>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      {sector.description}
                    </p>

                    <div className="flex items-center text-xs font-semibold text-cyan-500 gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      View Laws <span>→</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* DETAIL VIEW */
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={() => setSelectedSector(null)}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition group px-4 py-2 rounded-full hover:bg-white/5 w-fit"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Go Back
              </button>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* Header Blob */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${selectedSector.color} blur-[80px] opacity-20`}></div>

                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <span className="text-6xl">{selectedSector.icon}</span>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{selectedSector.title}</h1>
                    <p className="text-gray-400">{selectedSector.description}</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-6 text-cyan-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Basic Laws & Acts
                </h3>

                <div className="grid gap-4">
                  {selectedSector.laws.map((law, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/20 border border-white/5 p-4 rounded-xl hover:border-white/20 transition"
                    >
                      <h4 className="font-bold text-gray-200 mb-1">{law.title}</h4>
                      <p className="text-sm text-gray-400">{law.desc}</p>
                    </motion.div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  )
}