



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



import Availability from "../Models/availabilitySchema.js";

// Controller to add availability
export const addAvailability = async (req, res) => {
  const { date, slot } = req.body;
  const professorId = req.params.id;

  // Basic validation
  if (!date || !slot || !/^([0-1][0-9]|2[0-3]):00-([0-1][0-9]|2[0-3]):00$/.test(slot)) {
    return res.status(400).json({ error: "Invalid date or slot format. Slot must be in HH:00-HH:00 format." });
  }

  const [start, end] = slot.split("-");
  const startTime = parseInt(start.split(":")[0]);
  const endTime = parseInt(end.split(":")[0]);

  if (endTime <=st) {
    return res.status(400).json({ error: "Each slot must be exactly one hour long." });
  }

  try {
    // Ensure the authenticated user matches the professorId
    if (req.user.role !== "professor" || req.user.userId !== professorId) {
      return res.status(403).json({ error: "Unauthorized to set availability for this professor." });
    }

    // Find or create availability
    const availability = await Availability.findOne({ professorId });

    if (availability) {
      const existingDate = availability.timeSlots.find((entry) => entry.date === date);

      if (existingDate) {
        if (existingDate.slots.includes(slot)) {
          return res.status(400).json({ error: "This slot already exists for the given date." });
        }
        existingDate.slots.push(slot);
      } else {
        availability.timeSlots.push({ date, slots: [slot] });
      }

      await availability.save();
      return res.status(201).json({ message: "Availability updated successfully", availability });
    } else {
      const newAvailability = new Availability({
        professorId,
        timeSlots: [{ date, slots: [slot] }],
      });
      await newAvailability.save();
      return res.status(201).json({ message: "Availability added successfully", newAvailability });
    }
  } catch (err) {
    console.error("Error in addAvailability:", err);
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
