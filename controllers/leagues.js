const League = require('../classes/leagues');

exports.displayLeagues = (req, res) => {
  // res.send("Display Private and Public leagues")
  League.test();
  res.render("leagues");
};

exports.displayLeaguesMatches = (req, res) => {
  // res.send("Display Private and Public leagues")
  res.render("leagueMatch");
};

exports.createLeague = (req, res) => {
  res.send("Create League Karega on form submission");
};

exports.leagueLeaderboard = (req, res) => {
  //   res.send(`Display Leaderboard of league code ${req.params.leagueCode}`);
  console.log("hshshsh");
  res.render("leaderboard");
};

exports.displayCreateTeam = (req, res) => {
  res.send(
    `Team making interface for league code ${req.params.leagueCode} with fixture id ${req.params.fixtureId}`
  );
};

exports.createTeam = (req, res) => {
  res.send(`Create Team post req`);
};
