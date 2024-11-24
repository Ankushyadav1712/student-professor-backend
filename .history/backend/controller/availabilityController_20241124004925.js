



// availabilityController.js
// import Availability from "../Models/availabilitySchema.js";

// // Controller to add availability
// export const addAvailability = async (req, res) => {
//   const { date, slot } = req.body;
//   const professorId = req.params.id;

//   // Basic validation
//   if (!date || !slot || slot.length === 0) {
//     return res.status(400).json({ error: "Date and timeSlots are required." });
//   }

//   try {
//     // Ensure the authenticated user matches the professorId
//     if (req.user.role !== "professor" || req.user.userId !== professorId) {

//       return res.status(403).json({ error: "Unauthorized to set availability for this professor." });
//     }

//     // Create availability
//     const availability = await Availability.findOne({ professorId });

//         if (availability) {
//           const existingDate = availability.timeSlots.find(slot => slot.date === date);
//           if(existingDate) {
//             // existingDate.slots.push(slot)
//             existingDate.slots = [...new Set([...existingDate.slots, slot])]
//           }
//           else{
//             availability.timeSlots.push({ date, slots: [slot] });
//           }
//             // Add new date and slots
//             await availability.save();
//             return res.status(201).json({message:"Availability updated successfully", availability});
//           } else {
//             // Create new availability document if not exists
//             const newAvailability = new Availability({
//               professorId,
//               timeSlots: [{ date, slots:[slot] }],
//             });
//             await newAvailability.save();
//             return res.status(201).json({message:"Availability updated successfully", newAvailability});
//         }
//   } catch (err) {
//     console.error("Error in addAvailability:", err);
//     res.status(400).json({ error: err.message });
//   }
// };

         // for 1 hour appoitment 

// import Availability from "../Models/availabilitySchema.js";

// // Controller to add availability
// export const addAvailability = async (req, res) => {
//   const { date, slot } = req.body;
//   const professorId = req.params.id;

//   // Basic validation
//   if (!date || !slot || !/^([0-1][0-9]|2[0-3]):00-([0-1][0-9]|2[0-3]):00$/.test(slot)) {
//     return res.status(400).json({ error: "Invalid date or slot format. Slot must be in HH:00-HH:00 format." });
//   }

//   const [start, end] = slot.split("-");
//   const startTime = parseInt(start.split(":")[0]);
//   const endTime = parseInt(end.split(":")[0]);

//   if (endTime - startTime !== 1) {
//     return res.status(400).json({ error: "Each slot must be exactly one hour long." });
//   }

//   try {
//     // Ensure the authenticated user matches the professorId
//     if (req.user.role !== "professor" || req.user.userId !== professorId) {
//       return res.status(403).json({ error: "Unauthorized to set availability for this professor." });
//     }

//     // Find or create availability
//     const availability = await Availability.findOne({ professorId });

//     if (availability) {
//       const existingDate = availability.timeSlots.find((entry) => entry.date === date);

//       if (existingDate) {
//         if (existingDate.slots.includes(slot)) {
//           return res.status(400).json({ error: "This slot already exists for the given date." });
//         }
//         existingDate.slots.push(slot);
//       } else {
//         availability.timeSlots.push({ date, slots: [slot] });
//       }

//       await availability.save();
//       return res.status(201).json({ message: "Availability updated successfully", availability });
//     } else {
//       const newAvailability = new Availability({
//         professorId,
//         timeSlots: [{ date, slots: [slot] }],
//       });
//       await newAvailability.save();
//       return res.status(201).json({ message: "Availability added successfully", newAvailability });
//     }
//   } catch (err) {
//     console.error("Error in addAvailability:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


import Availability from "../Models/availabilitySchema.js";
import Appointment from "../Models/appointmentSchema.js";

export const bookAppointment = async (req, res) => {
  const { professorId, date, slot } = req.body; // e.g., slot: "10:30-11:30"
  const studentId = req.user.userId;

  if (!date || !slot || !/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot)) {
    return res.status(400).json({ error: "Date and valid time slot are required. Format: HH:mm-HH:mm." });
  }

  const [start, end] = slot.split("-");
  const startTime = new Date(`${date}T${start}:00`);
  const endTime = new Date(`${date}T${end}:00`);

  if (endTime <= startTime) {
    return res.status(400).json({ error: "End time must be after start time." });
  }

  try {
    // Check if the slot overlaps with the professor's availability
    const availability = await Availability.findOne({ professorId });

    if (!availability) {
      return res.status(404).json({ error: "No availability found for this professor." });
    }

    const availableDate = availability.timeSlots.find((entry) => entry.date === date);

    if (!availableDate) {
      return res.status(400).json({ error: "No availability for this date." });
    }

    const isSlotAvailable = availableDate.slots.some((availableSlot) => {
      const [availableStart, availableEnd] = availableSlot.split("-");
      const availableStartTime = new Date(`${date}T${availableStart}:00`);
      const availableEndTime = new Date(`${date}T${availableEnd}:00`);

      return (
        startTime >= availableStartTime && endTime <= availableEndTime // Ensure slot fits within availability
      );
    });

    if (!isSlotAvailable) {
      return res.status(400).json({ error: "The selected slot is outside the available time range." });
    }

    // Check if the slot overlaps with existing appointments
    const overlappingAppointment = await Appointment.findOne({
      professorId,
      date,
      $or: [
        { slot: { $gte: start, $lt: end } }, // Overlaps at start
        { slot: { $gt: start, $lte: end } }, // Overlaps at end
        { slot: { $lte: start, $gte: end } }, // Fully overlaps
      ],
    });

    if (overlappingAppointment) {
      return res.status(400).json({ error: "This slot overlaps with an existing appointment." });
    }

    // Book the appointment
    const newAppointment = new Appointment({
      professorId,
      studentId,
      date,
      slot,
    });

    await newAppointment.save();
    return res.status(201).json({ message: "Appointment booked successfully", newAppointment });
  } catch (err) {
    console.error("Error in bookAppointment:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Controller to view availability
export const viewAvailability = async (req, res) => {
  const professorId = req.params.id;

  try {
    const availability = await Availability.find({ professorId });

    if (availability.length === 0) {
      return res.status(404).json({ message: "No availability found for this professor." });
    }

    
    res.json(availability);
  } catch (err) {
    console.error("Error in viewAvailability:", err);
    res.status(400).json({ error: err.message });
  }
};
