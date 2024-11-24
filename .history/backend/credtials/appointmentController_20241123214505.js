// appointmentController.js
odels/Appointment';

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
  const studentId = req.user.userId;

  try {
    const appointments = await Appointment.find({ studentId });
    res.json(appointments);
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
  