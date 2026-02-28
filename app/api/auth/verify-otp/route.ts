import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Otp from "@/models/Otp"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { email, otp } = await req.json()

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
        }

        // Find OTP record
        const otpRecord = await Otp.findOne({ email, otp })

        if (!otpRecord) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
        }

        // Success - Delete OTP so it can't be reused
        await Otp.deleteOne({ _id: (otpRecord as { _id: string })._id })

        return NextResponse.json({ success: true, message: "Email verified successfully" })
    } catch (error: unknown) {
        console.error("Verify OTP Error:", error)
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
