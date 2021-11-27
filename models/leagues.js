const mongoose = require('mongoose')

const leagueSchema = new mongoose.Schema({
    leagueCode: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
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
    displayDetails: {
        type: Object
    },
    createdBy: {
        type: String
    },
    endDate: {
        type: Date
    },
    users: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Users'
    }]
})

module.exports = mongoose.model('Leagues' , leagueSchema)