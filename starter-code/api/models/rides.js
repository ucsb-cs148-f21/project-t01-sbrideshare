const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
    name: String,  
    leave_datetime: Date, 
    start_location: String, 
    end_location: String, 
    price: Number, 
    seats_available: Number, 
    driver_id: Number,
    riders: Array
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