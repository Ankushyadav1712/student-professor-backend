
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


export const cancelAppointment = async (req, res) => {
  const { professorId, date, slots } = req.body;

  try {
    const appointment = await Appointment.findOne({ professorId, timeSlot:date, timeSlot:slots });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status === 'canceled') {
      return res.status(400).json({ error: 'This appointment is already canceled' });
    }

    appointment.status = 'canceled';
    await appointment.save();

    res.status(200).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};






import Appointment from '../Models/appointmentSchema.js';
import Availability from '../Models/availabilitySchema.js';

export const bookAppointment = async (req, res) => {
  const { professorId, date, slots } = req.body;
  const studentId = req.user.userId;
  console.log(professorId,date,slots)
  try {
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

// // Controller to view availability
// export const viewAvailability = async (req, res) => {
//   const professorId = req.params.id;

//   try {
//     const availability = await Availability.findOne({ professorId });

//     if (!availability || availability.timeSlots.length === 0) {
//       return res.status(404).json({ message: "No availability found for this professor." });
//     }

//     // Filter out slots that are already booked
//     const bookedAppointments = await Appointment.find({
//       professorId,
//       status: 'confirmed',
//     });

//     const bookedSlots = bookedAppointments.map(
//       (appointment) => `${appointment.date}-${appointment.timeSlot}`
//     );

//     const availableTimeSlots = availability.timeSlots.map((entry) => {
//       const availableSlots = entry.slots.filter(
//         (slot) => !bookedSlots.includes(`${entry.date}-${slot}`)
//       );
//       return {
//         date: entry.date,
//         slots: availableSlots,
//       };
//     });

//     // Remove dates with no available slots
//     const filteredTimeSlots = availableTimeSlots.filter((entry) => entry.slots.length > 0);

//     if (filteredTimeSlots.length === 0) {
//       return res.status(404).json({ message: "No available slots for this professor." });
//     }

//     res.status(200).json({ professorId, availability: filteredTimeSlots });
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching availability: " + err.message });
//   }
// };



// import Appointment from "../Models/appointmentSchema.js";

// Controller to get a student's appointments
export const getStudentAppointments = async (req, res) => {
  const studentId = req.params.id;
  console.log(studentId);
  try {
    // Find all appointments for the student
    const appointments = await Appointment.find({ studentId });

    // Check if there are any appointments
    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this student." });
    }

    // Filter pending appointments
    const pendingAppointments = appointments.filter(
      (appointment) => appointment.status === "confirmed" // Adjust if status differs
    );

    if (pendingAppointments.length === 0) {
      return res.status(200).json({
        message: "You have no pending appointments.",
        appointments: [],
      });
    }

    res.status(200).json({
      message: "Pending appointments retrieved successfully.",
      appointments: pendingAppointments,
    });
  } catch (err) {
    console.error("Error in getStudentAppointments:", err);
    res.status(500).json({ error: "Error fetching appointments: " + err.message });
  }
};






