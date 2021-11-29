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
    rider_radius: Number,
    price: Number, 
    seats_available: Number, 
    driver_id: String,
    contact: String,
    riders: [{
        rider_id: String,
        rider_name: String,
        pickup_address: String, 
        note_to_driver: String
    }]
})

module.exports = mongoose.model('Rides', rideSchema)
