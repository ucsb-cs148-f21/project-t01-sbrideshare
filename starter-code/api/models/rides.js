const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
    name: String,  
    leave_datetime: Date, 
    start_location: String, 
    end_location: String, 
    price: Number, 
    seats_available: Number, 
    driver_id: String,
    riders: [String]
})

module.exports = mongoose.model('Rides', rideSchema)
