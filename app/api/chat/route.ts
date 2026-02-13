import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Using your fallback key (though .env is better!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCYA-OYqy3-NbURlOfNakRD4W5XShSsv5k");

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Use 2.5-flash as 1.5-flash is deprecated/unavailable
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a helpful legal assistant for Law-Sarthi. 
      The user has selected the language: ${language || 'en-US'}. 
      Please respond in this language. 
      If the user asks in a different language, adapt to that language, but prioritize the selected language context.`
    });

    // This mimics your "history" logic from the Node script
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful assistant chatbot for Law-Sarthi." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am ready to help." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ reply: response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "AI service failed to respond" }, { status: 500 });
  }
}