const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    teamId: {
        type: String,
        required: true
    },
    createdBy : {
        type: String,
        required: true
    },
    leagueCode : {
        type: String,
        required: true
    },
    fixtureId: {
        type: Number,
        required: true
    },
    players: {
        type: Array,
        required: true
    },
    points: {
        type: Number
    }
})

module.exports = mongoose.model('Teams' , teamSchema)