const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema({
    name: String,  
    leave_datetime: Date, 
    start_location: {
        formatted_address: String,
        lat: Number,
        lng: Number
    }, 
    end_location: {
        formatted_address: String,
        lat: Number,
        lng: Number
    },
    price: Number, 
    seats_available: Number, 
    driver_id: String,
    riders: [String]
})

module.exports = mongoose.model('Rides', rideSchema)
