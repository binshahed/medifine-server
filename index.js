const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
var cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hoqfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

async function run () {
  try {
    await client.connect()
    const database = client.db('medicare')
    const appointmentsCollection = database.collection('appointments')

    // Post Appointment
    app.post('/appoints', async (req, res) => {
      const appointment = req.body
      console.log(appointment)
      const result = await appointmentsCollection.insertOne(appointment)
      res.json(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
