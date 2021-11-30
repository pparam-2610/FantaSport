const League = require('../models/leagues');
const Team = require('../models/teams');
const axios = require("axios");
const leagues = require('../models/leagues');
const teams = require('../models/teams');

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
    static async calculatePoints(fixtureDetails){
        let fixtureData;
        let battingArray = [];
        let battingStats = [];
        let bowlingArray = [];
        let bowlingStats = [];
        let config = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/fixtures/'+ fixtureDetails.fixtureId + '?api_token=' + process.env.API_KEY + '&include=batting,bowling',
            headers: { }
        };
          
        await axios(config)
        .then(function (response) {
        fixtureData = response.data.data;
        })
        .catch(function (error) {
        console.log(error);
        })

        fixtureData.batting.forEach((batsman)=> {
            battingArray.push(batsman.player_id);
            battingStats.push({ runs: batsman.score, fours: batsman.four_x, sixes: batsman.six_x })
        });

        fixtureData.bowling.forEach((bowler) => {
            bowlingArray.push(bowler.player_id);
            bowlingStats.push({ runs: bowler.runs, wickets: bowler.wickets, rate: bowler.rate });
        });

        console.log(battingArray, battingStats, bowlingArray, bowlingStats);
        
        let fixtureTeams = await Team.find({ fixtureId: fixtureDetails.fixtureId });

        fixtureTeams.forEach((team)=> {
            team.players.forEach((player)=> {
                if(battingArray.includes(player.id)) player.batStats = battingStats[battingArray.indexOf(player.id)];
                if(bowlingArray.includes(player.id)) player.bowlStats = bowlingStats[bowlingArray.indexOf(player.id)];
                let playerPoints = 0;
                if(player.batStats){
                    playerPoints += player.batStats.runs + player.batStats.fours + 2*player.batStats.sixes;
                    if(player.batStats.runs > 100){
                        playerPoints += 16;
                    } else if(player.batStats.runs > 50){
                        playerPoints += 8;
                    } else if(player.batStats.runs > 30){
                        playerPoints += 4;
                    }
                    if(player.batStats.runs == 0){
                        playerPoints -= 2;
                    }
                }
                if(player.bowlStats){
                    playerPoints += player.bowlStats.wickets*25;
                    if(player.bowlStats.rate>12){
                        playerPoints -= 6;
                    } else if(player.bowlStats.rate > 10){
                        playerPoints -= 2;
                    } else if(player.bowlStats.rate>7){
                        playerPoints += 0;
                    } else if(player.bowlStats.rate > 6){
                        playerPoints += 2;
                    } else if(player.bowlStats.rate > 5){
                        playerPoints += 4;
                    } else if(player.bowlStats.rate < 5){
                        playerPoints += 6;
                    }
                }
            })
        })

        for(let j=0; j<fixtureTeams.length; j++){
            await fixtureTeams[j].save();
        }

        console.log("All Teams: ", fixtureTeams);

        return fixtureTeams;

    }
}

module.exports = Teams;