const Teams = require('../classes/teams');

exports.displayAllTeams = async (req, res) => {
  let teamHistory = await Teams.getTeams({ userId: req.user._id });
  // res.send("History Wala (Previous Teams & Current Teams)")
  res.render("history", { teamHistory : teamHistory });
};

exports.displayTeam = async (req, res) => {
  let teamDetails = await Teams.viewPlayers({ teamId : req.params.teamId });
  res.render("teamDetails", { teamDetails: teamDetails });
};

exports.calculatePoints = async (req,res) => {
  let fixtureTeams = await Teams.calculatePoints({ fixtureId: req.params.fixtureId });
  console.log("fixtureTeams:", fixtureTeams);
  res.send(fixtureTeams);
}
