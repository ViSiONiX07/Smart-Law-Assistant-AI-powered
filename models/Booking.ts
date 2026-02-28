import mongoose, { Schema, models, Document } from "mongoose"

export interface IBooking extends Document {
  type: "scheduled" | "instant"
  lawyerId: string
  lawyerName: string
  specialty: string
  userEmail: string
  date?: string
  time?: string
  status: "Pending" | "Cancelled" | "Completed"
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["scheduled", "instant"],
      required: true,
    },
    lawyerId: { type: String, required: true },
    lawyerName: { type: String, required: true },
    specialty: { type: String, required: true },
    userEmail: { type: String, required: true },
    date: String,
    time: String,
    status: {
      type: String,
      enum: ["Pending", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
)

const Booking = models.Booking || mongoose.model<IBooking>("Booking", BookingSchema)
export default Booking