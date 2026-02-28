import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"

/* =========================================
   CREATE BOOKING
========================================= */
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.type || !body.lawyerName || !body.specialty || !body.userEmail) {
      return NextResponse.json(
        { error: "Invalid booking data" },
        { status: 400 }
      )
    }

    // ===== Scheduled Booking Validation =====
    if (body.type === "scheduled") {
      if (!body.date || !body.time) {
        return NextResponse.json(
          { error: "Date and time required" },
          { status: 400 }
        )
      }

      const selected = new Date(body.date)
      selected.setHours(0, 0, 0, 0)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const endOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      )
      endOfMonth.setHours(23, 59, 59, 999)

      if (selected < today) {
        return NextResponse.json(
          { error: "Past dates not allowed" },
          { status: 400 }
        )
      }

      if (selected > endOfMonth) {
        return NextResponse.json(
          { error: "Booking allowed only within current month" },
          { status: 400 }
        )
      }

      // Prevent double booking
      const existing = await Booking.findOne({
        lawyerId: body.lawyerId as string,
        date: body.date as string,
        time: body.time as string,
        status: "Pending",
      })

      if (existing) {
        return NextResponse.json(
          { error: "Slot already booked" },
          { status: 409 }
        )
      }
    }

    const booking = await Booking.create({
      ...body,
      status: "Pending",
    })

    return NextResponse.json(booking, { status: 201 })

  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/* =========================================
   GET BOOKINGS
========================================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    const filter = email ? { userEmail: email } : {}

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })

    return NextResponse.json(bookings)

  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/* =========================================
   UPDATE BOOKING STATUS
========================================= */
export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "Missing id or status" },
        { status: 400 }
      )
    }

    // Using safer type handle for mongoose options
    await Booking.findByIdAndUpdate(
      body.id,
      { status: body.status },
      { new: true }
    )

    return NextResponse.json({ success: true })

  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

/* =========================================
   DELETE BOOKING
========================================= */
export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing booking id" },
        { status: 400 }
      )
    }

    await Booking.findByIdAndDelete(body.id)

    return NextResponse.json({ success: true })

  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}