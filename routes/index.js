if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const axios = require("axios");
const League = require("../models/leagues");
const Users = require("../models/users");
const Teams = require("../models/teams");

router.get("/checkDbLeagues", async (req,res)=> {
  // const updateLeague = await League.findOne({_id : '61a4fe6e65c97fbf630ae8e0'});
  // updateLeague.users.push('61a23805202746fd7a3e8416');
  // await updateLeague.save();
  // res.send(updateLeague);
  League.find({}, (err, leagues)=> {
    if(err) throw err;
    res.send(leagues);
  });
})

router.get("/checkDbTeams", async (req,res)=> {
  Teams.find({}, (err, teams)=> {
    if(err) throw err;
    res.send(teams);
  });
})

router.get("/checkDbUsers", async (req,res)=> {
  Users.find({}, (err, users)=> {
    if(err) throw err;
    res.send(users);
  });
})

router.get("/", (req, res) => {
  // res.send('Hello Bhushan')
  res.render("index");
});

router.get("/unauthorized", (req, res) => {
  // res.send('Hello Bhushan')
  res.render("notAuthorized");
});

router.get("/profile", (req, res) => {
  res.send("Profile Details Here");
  //   res.render("leaderboard");
});

router.get("/stages",async (req, res) => {//All Stages (Isme se select karke create league karega banda
  let data
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

  let config = {
    method: 'get',
    url: 'https://cricket.sportmonks.com/api/v2.0/fixtures?api_token='+ process.env.API_KEY + '&filter[starts_between]='+today+','+after,
    headers: {}
  };
  
  await axios(config)
  .then(function (response) {
    data = response.data.data;
    // console.log(JSON.stringify(response.data.data));
  })
  .catch(function (error) {
    console.log(error);
  });

  let stageIdArr = [];
  let stageData = [];
  data.forEach((fixture)=> {
    if(!stageIdArr.includes(fixture.stage_id)){
      stageIdArr.push(fixture.stage_id);
    }
  });
  for(let i=0; i<stageIdArr.length; i++){
      let config2 = {
        method: 'get',
        url: 'https://cricket.sportmonks.com/api/v2.0/stages/'+ stageIdArr[i]  + '?api_token=' + process.env.API_KEY,
        headers: {}
      }
      await axios(config2)
      .then(async (response) => {
        stageData.push(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  
  for(let j=0; j<stageData.length; j++){
    let config3 = {
      method: 'get',
      url: 'https://cricket.sportmonks.com/api/v2.0/leagues/'+ stageData[j].league_id  + '?api_token=' + process.env.API_KEY,
      headers: {}
    }
    await axios(config3)
    .then((resp)=> {
      stageData[j].image_path = resp.data.data.image_path;
      if(stageData[j].league_id != 3) stageData[j].name = resp.data.data.name
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  console.log("FINAL DATA:",stageData);
  res.render("home",{stageData : stageData});
  
});

router.get("/upcoming", async(req, res) => {
  let data;
  let stageArr = [];
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

  let config = {
    method: 'get',
    url: 'https://cricket.sportmonks.com/api/v2.0/fixtures?api_token='+ process.env.API_KEY + '&sort=starting_at&filter[starts_between]='+today+','+after,
    headers: {}
  };
  
  await axios(config)
  .then(function (response) {
    data = response.data.data;
  })
  .catch(function (error) {
    console.log(error);
  });
  data.forEach((e)=> {
    if(!stageArr.includes(e.stage_id)) stageArr.push(e.stage_id);
  });
  for(let i=0; i<stageArr.length; i++){
    let leagues = await League.find({ stageId: stageArr[i] });
    let leagues1 = await League.findOne({ stageId: stageArr[i], private: false });
    // console.log(leagues1);
    if(leagues.length == 0) {
      data.filter( fixture => fixture.stage_id != stageArr[i] );
    } else{
      data.forEach((e)=> {
        if(e.stage_id == stageArr[i]) e.leagueCode = (leagues1? leagues1.leagueCode : "");
      })
    }
  }
  console.log("Data: ",data)
  res.render("upcoming", { data: data });
});

module.exports = router;
