const League = require('../models/leagues');
const Team = require('../models/teams');
const axios = require("axios");

class leagues{
    static async getLeagueMatches(leagueDetails) {

        let today = new Date();
        let after = new Date(today);
        after.setDate(after.getDate() + 20)
        let dd = today.getDate();
        let mm = today.getMonth()+1; 
        let yyyy = today.getFullYear();
        let dd1 = after.getDate();
        let mm1 = after.getMonth()+1; 
        let yyyy1 = after.getFullYear();
        if(dd<10) dd='0'+dd; 
        if(mm<10) mm='0'+mm;
        today = yyyy+'-'+mm+'-'+dd;
        if(dd1<10) dd1='0'+dd1; 
        if(mm1<10) mm1='0'+mm1;
        after = yyyy1+'-'+mm1+'-'+dd1;

        let dbLeagueData = await League.findOne({ leagueCode: leagueDetails.leagueCode });
        console.log("DB Data: ", dbLeagueData);
        let stageId = dbLeagueData.stageId;
        let fixtureData;
        let config = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/fixtures?filter[stage_id]='+ stageId + '&sort=starting_at&api_token='+ process.env.API_KEY + '&filter[starts_between]='+today+','+after,
            headers: { }
          };
          
        await axios(config)
          .then(function (response) {
            fixtureData = response.data.data;
            for(let i=0; i < fixtureData.length ; i++){
                fixtureData[i].leagueDetails = dbLeagueData.displayDetails;
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        return fixtureData
    };
    static async viewPlayers(fixtureDetails){
        let fixtureData;
        let team1Data;
        let team2Data;
        let config = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/fixtures/'+ fixtureDetails.fixtureId + '?api_token=' + process.env.API_KEY,
            headers: { }
          };
          
          await axios(config)
          .then(function (response) {
            fixtureData = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          })

          let config1 = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/teams/'+ fixtureData.localteam_id +'/squad/'+ fixtureData.season_id + '?api_token=' + process.env.API_KEY,
            headers: { }
          };
          
          await axios(config1)
          .then(function (response) {
            team1Data = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

          let config2 = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/teams/'+ fixtureData.visitorteam_id +'/squad/'+ fixtureData.season_id + '?api_token=' + process.env.API_KEY,
            headers: { }
          };
          
          await axios(config2)
          .then(function (response) {
            team2Data = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

          fixtureData.team1Data = team1Data;
          fixtureData.team2Data = team2Data;

          return fixtureData;
    };
    static async createTeam(teamData){

        let fixtureData;
        let config = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/fixtures/'+ teamData.fixtureId + '?api_token='+ process.env.API_KEY,
            headers: { }
          };
          
          await axios(config)
          .then(function (response) {
            fixtureData = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        const leagueDetails = await League.findOne({ leagueCode: teamData.leagueCode });
        fixtureData.image_path = leagueDetails.displayDetails.image_path;
        fixtureData.name = leagueDetails.displayDetails.name;
        if(leagueDetails.private) fixtureData.leagueType = 'Private League'
        else fixtureData.leagueType = 'Public League'

        const newTeam = new Team({
            teamId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7),
            user: teamData.userId,
            leagueCode: teamData.leagueCode,
            fixtureId: teamData.fixtureId,
            fixtureDetails: fixtureData,
            players: teamData.playerData,
            points: 0,
            createDate: new Date(),
        })
        await newTeam.save();
        console.log(newTeam);
        return newTeam;
    }
}

class privateLeagues{
    static async createPrivateLeague(leagueDetails) {
        let stageData;
        let fixtureData;
        let endDate;
        let config = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/fixtures?api_token='+ process.env.API_KEY + '&filter[stage_id]='+ leagueDetails.stageId + '&sort=starting_at',
            headers: {}
        };
          
        await axios(config)
          .then(function (response) {
            fixtureData = response.data.data;
            endDate = fixtureData[fixtureData.length-1].starting_at;
            endDate = endDate.substr(0,10);
          })
          .catch(function (error) {
            console.log(error);
          });


        let config1 = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/stages/'+ leagueDetails.stageId  + '?api_token=' + process.env.API_KEY,
            headers: {}
          }
        await axios(config1)
          .then(async (response) => {
            stageData = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        let config2 = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/leagues/'+ leagueDetails.leagueId  + '?api_token=' + process.env.API_KEY,
            headers: {}
        }
        await axios(config2)
          .then((resp)=> {
            stageData.image_path = resp.data.data.image_path;
            if(stageData.league_id != 3) stageData.name = resp.data.data.name
          })
          .catch((err)=>{
            console.log(err);
          })
          console.log(leagueDetails.userId)

        const newLeague = new League({
            leagueCode : Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
            name: 'Private League',
            private: true,
            leagueId: leagueDetails.leagueId,
            stageId: leagueDetails.stageId,
            displayDetails : stageData,
            createdBy: leagueDetails.user,
            endDate: endDate,
            users: [leagueDetails.userId]
        })
        await newLeague.save();
        console.log("New Private League Created: ", newLeague);
        return newLeague;
    };
    static async getPrivateLeagues(userDetails){
        let privateLeagues = await League.find({users : userDetails._id, private: true});
        return privateLeagues;
    };
    static async joinPrivateLeague(leagueDetails){
        const updateLeague = await League.findOne({leagueCode : leagueDetails.leagueCode, private: true});
        if(!updateLeague.users.includes(leagueDetails.userId))
        {
            updateLeague.users.push(leagueDetails.userId);
        }
        await updateLeague.save();
        console.log('Private League joined', updateLeague);
        return updateLeague;
    }
}

class publicLeagues{
    static async createPublicLeague(leagueDetails) {
        let stageData;
        let config1 = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/stages/'+ leagueDetails.stageId  + '?api_token=' + process.env.API_KEY,
            headers: {}
          }
        await axios(config1)
          .then(async (response) => {
            stageData = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        let config2 = {
            method: 'get',
            url: 'https://cricket.sportmonks.com/api/v2.0/leagues/'+ leagueDetails.leagueId  + '?api_token=' + process.env.API_KEY,
            headers: {}
        }
        await axios(config2)
          .then((resp)=> {
            stageData.image_path = resp.data.data.image_path;
            if(stageData.league_id != 3) stageData.name = resp.data.data.name
          })
          .catch((err)=>{
            console.log(err);
          })
          console.log(leagueDetails.userId)

        const newLeague1 = new League({
            leagueCode:Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
            name: 'Public League',
            private: false,
            leagueId: leagueDetails.leagueId,
            stageId: leagueDetails.stageId,
            displayDetails : stageData,
            createdBy: leagueDetails.user,
            users: []
        })
        await newLeague1.save();
        console.log("New Public League Created: ", newLeague1);
        return newLeague1;
    };
    static async getPublicLeagues(userDetails){
        let publicLeagues = await League.find({private: false});
        return publicLeagues;
    }
    static async joinPublicLeague(leagueDetails){
        const updateLeague = await League.findOne({leagueCode : leagueDetails.leagueCode, private: false});
        if(!updateLeague.users.includes(leagueDetails.userId))
        {
            updateLeague.users.push(leagueDetails.userId);
        }
        await updateLeague.save();
        console.log('Public League joined', updateLeague);
        return updateLeague;
    }
}

module.exports = {
    leagues,
    privateLeagues,
    publicLeagues,
};
