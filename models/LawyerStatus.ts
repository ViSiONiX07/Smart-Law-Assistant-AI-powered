import mongoose, { Schema, models, Document } from "mongoose"

export interface ILawyerStatus extends Document {
    email: string
    name: string
    isAvailable: boolean
    lastUpdated: Date
    createdAt: Date
    updatedAt: Date
}

const LawyerStatusSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

const LawyerStatus = models.LawyerStatus || mongoose.model<ILawyerStatus>("LawyerStatus", LawyerStatusSchema)
export default LawyerStatus
