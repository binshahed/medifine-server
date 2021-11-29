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
console.log(uri)
client.connect(err => {
  const collection = client.db('test').collection('devices')
  // perform actions on the collection object
  client.close()
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
