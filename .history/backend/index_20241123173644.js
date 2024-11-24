// const express = require('express')
import ex
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Ankush!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})