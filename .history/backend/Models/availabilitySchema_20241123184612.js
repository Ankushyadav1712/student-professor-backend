import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({

    professorId: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true 
        },
    date: {
         type: String,
          required: true 
        }, // e.g., "2024-11-23"
    timeSlots: 
    { type: [String],
         required: true 
        }, // e.g., ["10:00-10:30", "11:00-11:30"]
    createdAt:
     { type: Date,
         default: Date.now
         },
});

const Availability = mongoose.model('Availability', availabilitySchema);

