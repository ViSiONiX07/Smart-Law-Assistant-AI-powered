import mongoose, { Schema, models, Document } from "mongoose"

export interface IOtp extends Document {
    email: string
    otp: string
    createdAt: Date
}

const OtpSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // Automatically delete after 5 minutes (300 seconds)
    },
})

const Otp = models.Otp || mongoose.model<IOtp>("Otp", OtpSchema)
export default Otp
