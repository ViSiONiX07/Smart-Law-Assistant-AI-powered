import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini with the key from your .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json({ error: "No description provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are a legal intake assistant. Analyze this user's legal issue: "${description}"
      
      Tasks:
      1. Classify the issue into EXACTLY one of these categories: 
         ["Criminal Law", "Corporate Law", "Civil Litigation", "Family Law", "Cyber Law"].
         If it doesn't fit well, choose the closest match or "Civil Litigation".
      2. Determine the urgency based on the text: [High, Medium, Low].
      3. Create a very brief (10-word max) summary.

      Return ONLY a JSON object in this format:
      {
        "category": "The Category Name",
        "urgency": "Urgency Level",
        "summary": "Short summary"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("Gemini Response:", responseText); // For debugging

    // Parse the AI string into a real JSON object to send to your frontend
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      // Fallback if JSON is malformed (rare with responseMimeType but possible)
      console.error("JSON Parse Error:", e);
      return NextResponse.json({ category: "Civil Litigation", urgency: "Medium", summary: "Error parsing AI response" });
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error("Classification API Error:", error);
    return NextResponse.json({ error: "Failed to analyze issue" }, { status: 500 });
  }
}