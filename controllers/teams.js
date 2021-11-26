exports.displayAllTeams = (req, res) => {
  // res.send("History Wala (Previous Teams & Current Teams)")
  res.render("history");
};

exports.displayTeam = (req, res) => {
  //   res.send("Single Team Pehle se banaya hua yaha display hoga");
  res.render("teamDetails");
};
