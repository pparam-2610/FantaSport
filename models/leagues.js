const mongoose = require('mongoose')

const leagueSchema = new mongoose.Schema({
    leagueCode: {
        type: String,
        required: true
    },
    private : {
        type: Boolean,
        required: true
    },
    leagueId: {
        type: Number
    },
    stageId: {
        type: Number
    },
    createdBy: {
        type: String
    }
})

module.exports = mongoose.model('Leagues' , leagueSchema)