const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId

const userSchema = new mongoose.Schema({
    full_name: String,  
    given_name: String, 
    family_name: String, 
    email: String, 
    id: String,
    drives: [ObjectId], 
    rides: [ObjectId],
    history: [ObjectId]
})

module.exports = mongoose.model('Users', userSchema)
