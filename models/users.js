const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    admin: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Users' , usersSchema)