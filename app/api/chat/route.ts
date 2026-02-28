import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log("Using OpenAI for message:", message);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful legal assistant for Law-Sarthi. 
          The user has selected the language: ${language || 'en-US'}. 
          Please respond in this language if possible.`
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI API Error Detail:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
    });
    return NextResponse.json({
      error: "AI service failed to respond",
      details: error.message
    }, { status: 500 });
  }
}