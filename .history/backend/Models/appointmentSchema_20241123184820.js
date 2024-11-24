import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    studentId: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
           required: true
         },
    professorId: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User', required: true },
    date: { type: String, required: true }, // e.g., "2024-11-23"
    timeSlot: { type: String, required: true }, // e.g., "10:00-10:30"
    status: { type: String, enum: ['confirmed', 'canceled'], default: 'confirmed' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
