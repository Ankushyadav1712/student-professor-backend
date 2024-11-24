// const express = require('express')
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import dbConnect from "../DB/dbConnect.js"

const app = express()

const PORT = process.env.PORT || 4002


dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello !')
})

app.listen(PORT, () => {
  console.log(`Server is running on  ${PORT}`)
})

server.listen(PORT,()=>{
    dbConnect();
    console.log(`Working at ${PORT}`);
})