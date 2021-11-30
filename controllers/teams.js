const Teams = require("../classes/teams");

exports.displayAllTeams = async (req, res) => {
  let teamHistory = await Teams.getTeams({ userId: req.user._id });
  // res.send("History Wala (Previous Teams & Current Teams)")
  res.render("history", { teamHistory: teamHistory, userData: req.user });
};

exports.displayTeam = async (req, res) => {
  let teamDetails = await Teams.viewPlayers({ teamId: req.params.teamId });
  res.render("teamDetails", { teamDetails: teamDetails });
};
