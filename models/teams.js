const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
    teamId: {
        type: String,
        required: true
    },
    user : { 
        type: Schema.Types.ObjectId, 
        ref: 'Users'
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