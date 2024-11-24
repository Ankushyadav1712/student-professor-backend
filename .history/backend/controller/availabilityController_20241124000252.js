// // availabilityController.js
// import Availability from "../Models/availabilitySchema.js";
// export const addAvailability = async (req, res) => {
//   const { date, timeSlots } = req.body;
//   const professorId = req.params.id;

//   try {
//     const availability = await Availability.create({
//       professorId,
//       date,
//       timeSlots
//     });
//     res.status(201).json(availability);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const viewAvailability = async (req, res) => {
//   const professorId = req.params.id;

//   try {
//     const availability = await Availability.find({ professorId });
//     res.json(availability);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };




// availabilityController.js
import Availability from "../Models/availabilitySchema.js";

// Controller to add availability
export const addAvailability = async (req, res) => {
  const { date, slot } = req.body;
  const professorId = req.params.id;

  // Basic validation
  if (!date || !slot || slot.length === 0) {
    return res.status(400).json({ error: "Date and timeSlots are required." });
  }

  try {
    // Ensure the authenticated user matches the professorId
    if (req.user.role !== "professor" || req.user.userId !== professorId) {

      return res.status(403).json({ error: "Unauthorized to set availability for this professor." });
    }

    // Create availability
    const availability = await Availability.findOne({ professorId });

        if (availability) {
            // Add new date and slots
            availability.timeSlots.push({ date, slot });
            await availability.save();
        } else {
            // Create new availability document if not exists
            const newAvailability = new Availability({
                professorId,
                timeSlots: [{ date, slots: }],
            });
            await newAvailability.save();
        }
    res.status(201).json({message:"Availability updated successfully", availability});
  } catch (err) {
    console.error("Error in addAvailability:", err);
    res.status(400).json({ error: err.message });
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