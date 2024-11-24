// // appointmentController.js
// import Appointment from '../Models/appointmentSchema.js';
// import Availability from '../Models/availabilitySchema.js';

// export const bookAppointment = async (req, res) => {
//   const { professorId, date, timeSlot } = req.body;
//   const studentId = req.user.userId;

//   try {
//     const appointment = await Appointment.create({
//       studentId,
//       professorId,
//       date,
//       timeSlot,
//       status: 'confirmed',
//     });
//     res.status(201).json(appointment);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

export const getAppointments = async (req, res) => {
  const professorId = req.params.id;
  console.log(professorId)

  try {
    const appointments = await Availability.find({ professorId });
    if(appointments)
    return res.json(appointments);

    return res.json({message: "No appointments available for this professor"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// appointmentController.js
// export const cancelAppointment = async (req, res) => {
//   const { professorId, date, slots } = req.body;
//     try {
//       const appointment = await Appointment.findByIdAndUpdate(
//         professorId,
//         { status: 'canceled' },
//         { new: true }
//       );
//       res.status(200).json(appointment);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   };
  

export const cancelAppointment = async (req, res) => {
  const { professorId, date, slots } = req.body;

  try {
    // Find the appointment based on professorId, date, and slots
    const appointment = await Appointment.findOne({ professorId, timeSlot:date, tslots });

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if the appointment is already canceled
    if (appointment.status === 'canceled') {
      return res.status(400).json({ error: 'This appointment is already canceled' });
    }

    // Update the status to canceled
    appointment.status = 'canceled';
    await appointment.save();

    res.status(200).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};






import Appointment from '../Models/appointmentSchema.js';
import Availability from '../Models/availabilitySchema.js';

// Controller to book an appointment
export const bookAppointment = async (req, res) => {
  const { professorId, date, slots } = req.body;
  const studentId = req.user.userId;
  console.log(professorId,date,slots)
  try {
    // Check if the slot is available
    const availability = await Availability.findOne({
      professorId,
      'timeSlots.date': date,
      'timeSlots.slots': slots,
    });

    if (!availability) {
      return res.status(400).json({ error: "The selected time slot is not available." });
    }

    // Check if the slot is already booked
    const isBooked = await Appointment.findOne({
      professorId,
      date,
      timeSlot:slots,
      status: 'confirmed',
    });

    if (isBooked) {
      return res.status(400).json({ error: "The selected time slot is already booked." });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      studentId,
      professorId,
      date,
      timeSlot:slots,
      status: 'confirmed',
    });
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ error: "Error booking appointment: " + err.message });
  }
};

// Controller to view availability
export const viewAvailability = async (req, res) => {
  const professorId = req.params.id;

  try {
    const availability = await Availability.findOne({ professorId });

    if (!availability || availability.timeSlots.length === 0) {
      return res.status(404).json({ message: "No availability found for this professor." });
    }

    // Filter out slots that are already booked
    const bookedAppointments = await Appointment.find({
      professorId,
      status: 'confirmed',
    });

    const bookedSlots = bookedAppointments.map(
      (appointment) => `${appointment.date}-${appointment.timeSlot}`
    );

    const availableTimeSlots = availability.timeSlots.map((entry) => {
      const availableSlots = entry.slots.filter(
        (slot) => !bookedSlots.includes(`${entry.date}-${slot}`)
      );
      return {
        date: entry.date,
        slots: availableSlots,
      };
    });

    // Remove dates with no available slots
    const filteredTimeSlots = availableTimeSlots.filter((entry) => entry.slots.length > 0);

    if (filteredTimeSlots.length === 0) {
      return res.status(404).json({ message: "No available slots for this professor." });
    }

    res.status(200).json({ professorId, availability: filteredTimeSlots });
  } catch (err) {
    res.status(500).json({ error: "Error fetching availability: " + err.message });
  }
};



