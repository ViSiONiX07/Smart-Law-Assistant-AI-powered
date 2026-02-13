import mongoose from "mongoose"

const LawyerStatusSchema = new mongoose.Schema(
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

export default mongoose.models.LawyerStatus ||
    mongoose.model("LawyerStatus", LawyerStatusSchema)
