import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
    professorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timeSlots: [
        {
            date: {
                type: String, // Use ISO string format for dates (e.g., 'YYYY-MM-DD') for consistency
                required: true,
            },
            slots: {
                type: [String], // Array of time slots for the specific date
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Availability = mongoose.model("Availability", availabilitySchema);

export default Availability;
