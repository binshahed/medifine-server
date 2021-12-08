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
    const usersCollection = database.collection('users')

    // Get Appointment
    app.get('/appoints', async (req, res) => {
      const email = req.query.email
      const date = new Date(req.query.date).toLocaleDateString()
      console.log(date)
      const query = { email: email, date: date }
      const cursor = appointmentsCollection.find(query)
      const appointments = await cursor.toArray()
      res.json(appointments)
    })
    // Post Appointment
    app.post('/appoints', async (req, res) => {
      const appointment = req.body
      console.log(appointment)
      const result = await appointmentsCollection.insertOne(appointment)
      res.json(result)
    })

    //POST user
    app.post('/users', async (req, res) => {
      const users = req.body
      console.log(users)
      const result = await usersCollection.insertOne(users)
      res.json(result)
    })
    // PUT user
    app.put('/users', async (req, res) => {
      const user = req.body
      const filter = { email: user.email }
      const options = { upsert: true }
      const updateDoc = { $set: user }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })
    // PUT ‍admin
    app.put('/users/admin', async (req, res) => {
      const user = req.body
      const filter = { email: user.email }
      const options = { upsert: true }
      const updateDoc = { $set: { role: 'admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      console.log(result)
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
