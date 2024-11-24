// const express = require('express')
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express()

const PORT = process.env.PORT || 4002
const URI = process.env.MONOGODB_URI;
dotenv.config();
try{
    mongoose.connect(URI)
    console.log(connected to db)
}catch(error){

}




// app.get('/', (req, res) => {
//   res.send('Hello !')
// })

app.listen(PORT, () => {
  console.log(`Server is running on  ${PORT}`)
})

