import request from 'supertest';
import app from '../'
import mongoose from 'mongoose';
import User from '../Models/userSchema'; // Assuming you have a User model
import Availability from '../Models/availabilitySchema'; // Availability model
import Appointment from '../Models/appointmentSchema'; // Appointment model

describe('E2E: Appointment Booking and Cancellation', () => {
  let studentA1, studentA2, professorP1, professorAuthToken, studentA1AuthToken, studentA2AuthToken;

  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.TEST_DATABASE_URL);

    // Seed database with users
    professorP1 = await User.create({ name: 'Professor P1', role: 'professor', email: 'professorp1@example.com', password: 'test123' });
    studentA1 = await User.create({ name: 'Student A1', role: 'student', email: 'studenta1@example.com', password: 'test123' });
    studentA2 = await User.create({ name: 'Student A2', role: 'student', email: 'studenta2@example.com', password: 'test123' });

    // Authenticate users to get tokens
    const professorLogin = await request(app).post('/auth/login').send({ email: professorP1.email, password: 'test123' });
    professorAuthToken = professorLogin.body.token;

    const studentA1Login = await request(app).post('/auth/login').send({ email: studentA1.email, password: 'test123' });
    studentA1AuthToken = studentA1Login.body.token;

    const studentA2Login = await request(app).post('/auth/login').send({ email: studentA2.email, password: 'test123' });
    studentA2AuthToken = studentA2Login.body.token;
  });

  afterAll(async () => {
    // Cleanup test data
    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});
    await mongoose.connection.close();
  });

  it('Professor P1 specifies availability', async () => {
    const response = await request(app)
      .post('/availability')
      .set('Authorization', `Bearer ${professorAuthToken}`)
      .send({
        professorId: professorP1._id,
        timeSlots: [{ date: '2024-12-01', slots: ['10:00', '11:00'] }],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Availability set successfully');
  });

  it('Student A1 views available time slots for Professor P1', async () => {
    const response = await request(app)
      .get(`/availability/${professorP1._id}`)
      .set('Authorization', `Bearer ${studentA1AuthToken}`);

    expect(response.status).toBe(200);
    expect(response.body.availability).toEqual([
      { date: '2024-12-01', slots: ['10:00', '11:00'] },
    ]);
  });

  it('Student A1 books an appointment with Professor P1 for time T1', async () => {
    const response = await request(app)
      .post('/appointment/book')
      .set('Authorization', `Bearer ${studentA1AuthToken}`)
      .send({
        professorId: professorP1._id,
        date: '2024-12-01',
        slots: '10:00',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Appointment booked successfully');
    expect(response.body.appointment).toHaveProperty('status', 'confirmed');
  });

  it('Student A2 books an appointment with Professor P1 for time T2', async () => {
    const response = await request(app)
      .post('/appointment/book')
      .set('Authorization', `Bearer ${studentA2AuthToken}`)
      .send({
        professorId: professorP1._id,
        date: '2024-12-01',
        slots: '11:00',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Appointment booked successfully');
    expect(response.body.appointment).toHaveProperty('status', 'confirmed');
  });

  it('Professor P1 cancels the appointment with Student A1', async () => {
    const response = await request(app)
      .post('/appointment/cancel')
      .set('Authorization', `Bearer ${professorAuthToken}`)
      .send({
        professorId: professorP1._id,
        studentId: studentA1._id,
        date: '2024-12-01',
        slots: '10:00',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'canceled');
  });

  it('Student A1 checks appointments and has none pending', async () => {
    const response = await request(app)
      .get('/appointment')
      .set('Authorization', `Bearer ${studentA1AuthToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); // No pending appointments
  });
});
