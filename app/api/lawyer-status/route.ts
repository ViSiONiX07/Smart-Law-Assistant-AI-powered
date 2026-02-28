import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import LawyerStatus from "@/models/LawyerStatus"

/* =========================================
   GET LAWYER STATUS
========================================= */
export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(req.url)
        const email = searchParams.get("email")

        if (email) {
            // Get specific lawyer status
            let status = await LawyerStatus.findOne({ email })

            // If not found, create default status
            if (!status) {
                status = await LawyerStatus.create({
                    email,
                    name: email.split("@")[0],
                    isAvailable: true,
                })
            }

            return NextResponse.json(status)
        } else {
            // Get all lawyer statuses
            const statuses = await LawyerStatus.find({})
            return NextResponse.json(statuses)
        }

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

/* =========================================
   UPDATE LAWYER STATUS
========================================= */
export async function PUT(req: NextRequest) {
    try {
        await connectDB()
        const body = await req.json()

        if (!body.email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        const status = await LawyerStatus.findOneAndUpdate(
            { email: body.email },
            {
                email: body.email,
                name: body.name || body.email.split("@")[0],
                isAvailable: body.isAvailable,
                lastUpdated: new Date(),
            },
            { upsert: true, new: true }
        )

        return NextResponse.json(status)

    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        )
    }
}
