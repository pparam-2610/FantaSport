const League = require('../models/leagues');
const Team = require('../models/teams');
const axios = require("axios");

class Teams{
    static async getTeams(userDetails){
        let cutoff = new Date();
        cutoff.setDate(cutoff.getDate()-30);
        let teams = await Team.find({ user: userDetails.userId, createDate: { $gte: cutoff } }).sort([['createDate', -1]]);
        console.log("Teams: ",teams);
        return teams
    };
    static async viewPlayers(teamDetails){
        const getTeam = await Team.findOne({ teamId : teamDetails.teamId });
        console.log("Team: ", getTeam);
        return getTeam;
    }
}

module.exports = Teams;