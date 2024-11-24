// availabilityController.js
import Availability from "../Models/availabilitySchema.js";
export const addAvailability = async (req, res) => {
  const { date, timeSlots } = req.body;
  const professorId = req.params.id;

  try {
    const availability = await Availability.create({
      professorId,
      date,
      timeSlots
    });
    res.status(201).json(availability);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const viewAvailability = async (req, res) => {
  const professorId = req.params.id;

  try {
    const availability = await Availability.find({ professorId });
    res.json(availability);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
