// appointmentController.js
import Appointment from '../Models/appointmentSchema.js';
import Availability from '../Models/availabilitySchema.js';

export const bookAppointment = async (req, res) => {
  const { professorId, date, timeSlot } = req.body;
  const studentId = req.user.userId;

  try {
    const appointment = await Appointment.create({
      studentId,
      professorId,
      date,
      timeSlot,
      status: 'confirmed',
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAppointments = async (req, res) => {
  const {professorId} = req.body;


  try {
    const appointments = await Availability.find({ professorId });
    if(appointments)
    return res.json(appointments);

    return res.json({message: "No appointments available for this professor:);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// appointmentController.js
export const cancelAppointment = async (req, res) => {
    const appointmentId = req.params.id;
  
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status: 'canceled' },
        { new: true }
      );
      res.status(200).json(appointment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  