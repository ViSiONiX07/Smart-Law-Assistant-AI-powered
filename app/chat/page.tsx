"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import ReactMarkdown from "react-markdown"
import { motion } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

// Language options
const LANGUAGES = [
  { code: "en-US", name: "English" },
  { code: "hi-IN", name: "Hindi" },
  { code: "bn-IN", name: "Bengali" },
  { code: "te-IN", name: "Telugu" },
  { code: "ta-IN", name: "Tamil" },
  { code: "mr-IN", name: "Marathi" },
]

export default function ChatPage() {
  const { user, openLoginModal } = useAuth()

  const [chat, setChat] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Voice & Language State
  const [language, setLanguage] = useState("en-US")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Load saved chat
  useEffect(() => {
    const saved = localStorage.getItem("law_saarthi_chat")
    if (saved) {
      const parsed = JSON.parse(saved)
      setChat((prev) => (JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed))
    }
  }, [])

  // Persist + auto-scroll
  useEffect(() => {
    localStorage.setItem("law_saarthi_chat", JSON.stringify(chat))
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  // Speech to Text (Listening)
  const startListening = () => {
    if (!user) {
      openLoginModal()
      return
    }
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-expect-error - webkitSpeechRecognition is not in the standard Window type
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = language
      recognition.continuous = false
      recognition.interimResults = true // Enable real-time typing

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      recognition.onerror = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        setIsListening(false)
        console.error("Speech recognition error", event.error)
      }

      recognition.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        if (event.results[current].isFinal) {
          setMessage((prev) => prev + (prev && !prev.endsWith(' ') ? " " : "") + transcript)
        }
      };

      recognition.start()
    } else {
      alert("Your browser does not support voice input. Please use Chrome or Edge.")
    }
  }

  // Text to Speech (Speaking)
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language

      // Attempt to find a matching voice
      const voices = window.speechSynthesis.getVoices()
      const matchingVoice = voices.find(v => v.lang.startsWith(language.split('-')[0])) // loose match first
        || voices.find(v => v.lang === language)

      if (matchingVoice) {
        utterance.voice = matchingVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    } else {
      alert("Your browser does not support text-to-speech.")
    }
  }

  const sendMessage = async () => {
    if (!user) {
      openLoginModal()
      return
    }
    if (!message.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: message.trim(),
      timestamp: new Date().toLocaleTimeString()
    }

    setChat(prev => [...prev, userMessage])
    setMessage("")
    setLoading(true)
    setError(null)

    try {
      const res = await axios.post("/api/chat", {
        message: userMessage.content,
        language: language // Send language context
      })

      const botMessage: Message = {
        role: "assistant",
        content: res.data.reply || "No response received.",
        timestamp: new Date().toLocaleTimeString()
      }

      setChat(prev => [...prev, botMessage])
    } catch (err: unknown) {
      console.error("Chat API error:", err)

      setError("Unable to connect to AI service.")
      setChat(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "AI service is temporarily unavailable. Please try again.",
          timestamp: new Date().toLocaleTimeString()
        }
      ])
    }

    setLoading(false)
  }

  const clearChat = () => {
    setChat([])
    localStorage.removeItem("law_saarthi_chat")
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0B0C15] text-gray-100 font-sans">

      {/* Sidebar */}
      <aside className="hidden md:flex w-72 bg-[#02040a] border-r border-white/5 flex-col justify-between p-6">
        <div>
          <h1 className="text-xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Law Saarthi
          </h1>

          <button
            onClick={clearChat}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Chat
          </button>
        </div>

        <div className="text-xs text-gray-600">
          Powered by Gemini 2.5 Flash
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col relative overflow-hidden">

        {/* Background Mesh (Subtle) */}
        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="bg-[#0B0C15]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center z-10">
          <h2 className="font-semibold text-gray-200">
            AI Legal Assistant
          </h2>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-white/10 rounded-lg px-3 py-1.5 text-sm bg-white/5 text-gray-300 outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#0B0C15] text-gray-300">
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 z-0">

          {chat.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <span className="text-3xl">⚖️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Welcome to Law Saarthi UI 2.0</h3>
              <p className="max-w-md mx-auto text-sm">Ask about IPC, cyber crime, property disputes, or draft legal agreements instantly.</p>
            </div>
          )}

          {chat.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user"
                ? "justify-end"
                : "justify-start"
                }`}
            >
              <div className="flex gap-4 max-w-3xl">

                {msg.role === "assistant" && (
                  <div className="flex flex-col gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 shadow-lg flex items-center justify-center text-xs font-bold text-white">
                      AI
                    </div>
                  </div>
                )}

                <div className="group relative">
                  <div
                    className={`px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm ${msg.role === "user"
                      ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white"
                      : "bg-white/10 border border-white/5 text-gray-200"
                      }`}
                  >
                    <ReactMarkdown components={{
                      strong: ({ ...props }) => <span className="font-bold text-cyan-200" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc ml-4 my-2" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal ml-4 my-2" {...props} />,
                    }}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  <div className="text-xs text-gray-500 mt-1 flex gap-2 items-center px-1">
                    {msg.timestamp}

                    {/* Speaker Button for Assistant */}
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => speak(msg.content)}
                        className="opacity-100 transition p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-cyan-400"
                        title="Read aloud"
                      >
                        {/* Speaker Icon SVG */}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm ml-12">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce delay-300"></div>
            </div>
          )}

          <div ref={scrollRef}></div>
        </div>

        {/* Input */}
        <div className="bg-[#0B0C15]/90 backdrop-blur-xl border-t border-white/5 px-8 py-6 z-20">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">

            {/* Mic Button */}
            <button
              onClick={startListening}
              className={`p-3 rounded-full border transition ${isListening
                ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              title="Speak"
            >
              {/* Mic Icon SVG */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                rows={1}
                placeholder={`Ask about Indian Legal matters in ${LANGUAGES.find(l => l.code === language)?.name || 'English'}...`}
                className="w-full resize-none border border-white/10 rounded-2xl px-5 py-3 
                            text-gray-100 bg-white/5 placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                            transition shadow-inner"
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-2xl 
                         hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>

          </div>

          {error && (
            <div className="text-sm text-red-400 mt-3 text-center bg-red-500/10 py-1 rounded-lg border border-red-500/20 max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}