// const express = require('express')
import express from "express"
import dotenv form "dotenv"
const app = express()

const PORT = process.env.PORT || 3000

// const port = 3000
dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello Ankush!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})