"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  } as const

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  } as const

  const laws = [
    {
      title: "Fundamental Rights",
      desc: "Know your constitutional rights as an Indian citizen.",
      icon: "⚖️",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-cyan-500/30",
    },
    {
      title: "Cyber Crime",
      desc: "Protection against online fraud, bullying, and data theft (IT Act).",
      icon: "🔒",
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
    },
    {
      title: "Women's Safety",
      desc: "POSH Act, Domestic Violence Act, and Dowry Prohibition.",
      icon: "🛡️",
      color: "from-pink-500/20 to-rose-500/20",
      border: "border-rose-500/30",
    },
    {
      title: "Traffic Rules",
      desc: "Motor Vehicles Act, fines, and road safety guidelines.",
      icon: "🚦",
      color: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/30",
    },
    {
      title: "Corporate Law",
      desc: "Startups, contracts, and company registration (Companies Act).",
      icon: "🏢",
      color: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
    },
    {
      title: "Consumer Rights",
      desc: "Fight against unfair trade practices and defective goods.",
      icon: "🛒",
      color: "from-indigo-500/20 to-blue-500/20",
      border: "border-indigo-500/30",
    }
  ]

  return (
    <main className="relative min-h-screen text-white overflow-hidden">

      {/* Background Anime Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[120px] animate-float opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-900/20 rounded-full blur-[120px] animate-float animation-delay-2000 opacity-40"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-48 pb-32 px-6 max-w-7xl mx-auto text-center">

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium uppercase tracking-wider text-gray-300">AI Legal Assistant Online</span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Justice, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Simplified.</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Navigate the complexity of Indian Law with AI. Instant answers, document drafting, and legal roadmaps tailored for you.
        </motion.p>

        <motion.div
          className="flex gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/chat">
            <button className="relative group px-8 py-4 rounded-full bg-white text-black font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              <span className="relative z-10">Consult AI Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </button>
          </Link>
          <Link href="/sectors">
            <button className="px-8 py-4 rounded-full glass text-white font-medium hover:bg-white/10 transition-all hover:scale-105">
              Learn More
            </button>
          </Link>
        </motion.div>

      </section>

      {/* STATS SECTION */}
      <section className="relative z-10 py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Users", value: "10k+" },
            { label: "Laws Covered", value: "500+" },
            { label: "Accuracy", value: "99%" },
            { label: "Support", value: "24/7" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{stat.value}</h3>
              <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KNOW YOUR RIGHTS - BENTO GRID */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Know Your <span className="text-cyan-400">Rights</span></h2>
          <p className="text-gray-400">Explore key areas of Indian Law simplified for everyone.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {laws.map((law, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`glass-card p-8 rounded-3xl relative overflow-hidden group border-t ${law.border}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${law.color} blur-[60px] opacity-20 group-hover:opacity-40 transition duration-500`}></div>

              <div className="text-4xl mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                {law.icon}
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition">{law.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {law.desc}
              </p>

              <Link href="/sectors" className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-white transition cursor-pointer">
                <span>Learn more</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </section>

      {/* FOOTER CTA */}
      <section className="relative z-10 py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto glass p-12 rounded-[3rem] border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          <h2 className="text-4xl font-bold mb-6">Ready to find answers?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Start chatting with Law Saarthi today and get instant legal clarity tailored to your situation.</p>
          <Link href="/chat">
            <button className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
              Start Free Consultation
            </button>
          </Link>
        </div>
      </section>

    </main>
  )
}