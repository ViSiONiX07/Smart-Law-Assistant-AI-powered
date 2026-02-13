import mongoose, { Schema, models } from "mongoose"

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

export default models.Booking || mongoose.model("Booking", BookingSchema)