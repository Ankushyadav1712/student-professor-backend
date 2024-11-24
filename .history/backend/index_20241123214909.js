// const express = require('express')
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { signup,login } from "./credtials/authController.js";
import { addAvailability, viewAvailability } from "./credtials/availabilityController.js";
import { bookAppointment,cancelAppointment,getAppointments } from "./credtials/appointmentController.js";
import { authenticateUser } from "./Middleware/authUser.js";
dotenv.config();

const app = express()

const PORT = process.env.PORT || 5001;
const URI = process.env.MONGODB_URI;
try{
    mongoose.connect(URI)
    console.log('connected to db')
}catch(error){
    console.log(error)

}




// app.get('/', (req, res) => {
//   res.send('Hello !')
// })

app.listen(PORT, () => {
  console.log(`Server is running on  ${PORT}`)
})
