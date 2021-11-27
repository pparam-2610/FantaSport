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
    fixtureDetails: {
        type: Object
    },
    players: {
        type: Array,
        required: true
    },
    points: {
        type: Number
    },
    createDate: {
        type: Date
    }
})

module.exports = mongoose.model('Teams' , teamSchema)