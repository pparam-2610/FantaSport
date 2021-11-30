const League = require("../classes/leagues").leagues;
const PrivateLeagues = require("../classes/leagues").privateLeagues;
const PublicLeagues = require("../classes/leagues").publicLeagues;

exports.displayLeagues = async (req, res) => {
  if (!req.user) res.redirect("/unauthorized");
  let privateLeagueData = await PrivateLeagues.getPrivateLeagues(req.user);
  let publicLeagueData = await PublicLeagues.getPublicLeagues(req.user);
  console.log(privateLeagueData, publicLeagueData);
  res.render("leagues", {
    privateLeagues: privateLeagueData,
    publicLeagues: publicLeagueData,
    userData: req.user,
  });
};

exports.displayLeaguesMatches = async (req, res) => {
  console.log("League Code:", req.params.leagueCode);
  let fixtureData = await League.getLeagueMatches({
    leagueCode: req.params.leagueCode,
  });
  console.log("Fixture Data: ", fixtureData);
  res.render("leagueMatch", {
    fixtureData: fixtureData,
    leagueCode: req.params.leagueCode,
  });
};

exports.createLeague = async (req, res) => {
  console.log("Body is: ", req.body, "User Is: ", req.user);
  console.log(process.env.ADMIN_ID === req.user._id);
  let league;
  if (req.user._id === process.env.ADMIN_ID) {
    league = await PublicLeagues.createPublicLeague({
      leagueId: req.body.leagueId,
      stageId: req.body.stageId,
      user: req.user.userId,
      userId: req.user._id,
    });
  } else {
    league = await PrivateLeagues.createPrivateLeague({
      leagueId: req.body.leagueId,
      stageId: req.body.stageId,
      user: req.user.userId,
      userId: req.user._id,
    });
  }
  // res.send("Create League Karega on form submission");
  res.redirect(`http://localhost:8000/stages?code=${league.leagueCode}`);
};

exports.joinLeague = async (req, res) => {
  console.log("ggggggg");

  if (req.user.userId == "admin") {
    res.redirect(`http://localhost:8000/stages`);
    // await PrivateLeagues.joinPrivateLeague({ leagueCode : req.params.leagueCode, userId : req.user._id });
  } else {
    let joinedLeague = await PrivateLeagues.joinPrivateLeague({
      leagueCode: req.body.leagueCode,
      userId: req.user._id,
    });

    res.redirect(
      `http://localhost:8000/leagues?code=${joinedLeague.leagueCode}`
    );
  }
  // res.send("Join League");
};

exports.leagueLeaderboard = (req, res) => {
  //   res.send(`Display Leaderboard of league code ${req.params.leagueCode}`);
  let leagueCode = req.params.leagueCode;
  let leaderboard = League.getLeaderboard({ leagueCode: leagueCode });
  res.render("leaderboard", { leagueCode: leagueCode });
};

exports.displayCreateTeam = async (req, res) => {
  let teamDetails = await League.viewPlayers({
    fixtureId: req.params.fixtureId,
  });
  teamDetails.leagueCode = req.params.leagueCode;
  teamDetails.fixtureId = req.params.fixtureId;
  console.log("Team Details: ", teamDetails);
  res.render("createTeam", { teamDetails: teamDetails });
};

exports.createTeam = async (req, res) => {
  // console.log("Body: ", req.body);
  let playerData = req.body.playerData;
  playerData.forEach((player) => {
    player.points = 0;
  });
  console.log(playerData);
  let newTeam = await League.createTeam({
    fixtureId: req.body.fixtureId,
    leagueCode: req.body.leagueCode,
    playerData: playerData,
    userId: req.user._id,
  });
  res.send({ success: true });
};
