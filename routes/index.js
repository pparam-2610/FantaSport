if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const axios = require("axios");

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

router.get("/upcoming", (req, res) => {
  //   res.send(
  //     "Idhar upcoming matches pel sakte hai which will redirect to its respective league"
  //   );
  res.render("upcoming");
});

module.exports = router;
