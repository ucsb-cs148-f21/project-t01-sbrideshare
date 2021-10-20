const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log('rides connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const rideSchema = new mongoose.Schema({
    location: String,
    name: String,
    date: Date,
    price: Number,
    phone: Number,
    seats_available: Number
})

const testRide = new mongoose.Schema({
    id: String,
    name: String,
    startLocation: String,
    endLocation: String,
    dayLeave: String,
    timeLeave: String
})

module.exports = mongoose.model('Rides', rideSchema)
module.exports = mongoose.model('TestRides', testRide)