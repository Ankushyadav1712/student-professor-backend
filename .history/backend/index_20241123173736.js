// const express = require('express')
import express from "express"
impo
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Ankush!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})