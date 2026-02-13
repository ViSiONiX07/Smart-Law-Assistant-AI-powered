import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Otp from "@/models/Otp"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    console.log("SENDING OTP: Connecting to DB...")
    await connectDB()
    console.log("SENDING OTP: DB Connected.")

    const { email } = await req.json()
    console.log("SENDING OTP: Target Email:", email)

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in DB (upsert)
    console.log("SENDING OTP: Storing code in DB...")
    await Otp.findOneAndUpdate(
      { email } as any,
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    )
    console.log("SENDING OTP: Stored successfully.")

    // Send email via Resend
    console.log("SENDING OTP: Sending email via Resend...")
    const { data, error } = await resend.emails.send({
      from: "Law Saarthi <onboarding@resend.dev>",
      to: email,
      subject: "Your Verification Code - Law Saarthi",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0891b2;">Law Saarthi Verification</h2>
          <p>Hello,</p>
          <p>Your verification code for Law Saarthi is:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #111;">
            ${otpCode}
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            This code will expire in 5 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend Error Detail:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("SENDING OTP: Email sent successfully.")
    return NextResponse.json({ success: true, message: "OTP sent successfully" })
  } catch (error: any) {
    console.error("CRITICAL Send OTP Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
