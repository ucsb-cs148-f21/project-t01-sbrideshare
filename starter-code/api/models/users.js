const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: String,
    fullName: String,  
    givenName: String, 
    familyName: String, 
    email: String, 
    drives: Array, 
    rides: Array,
    history: Array
})

module.exports = mongoose.model('Users', userSchema)
