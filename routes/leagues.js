const express = require("express");
const router = express.Router();

const leagueController = require("../controllers/leagues");

router.get("/", leagueController.displayLeagues);

router.get("/:leagueCode", leagueController.displayLeaguesMatches);

router.get("/createLeague", (req, res) => {
  res.send("Creates League ke liye page(if required)");
});

router.post("/createLeague", leagueController.createLeague);

router.get("/leaderboard/:leagueCode", leagueController.leagueLeaderboard);

router.get(
  "/createTeam/:leagueCode/:fixtureId",
  leagueController.displayCreateTeam
);

router.post("/createTeam", leagueController.createTeam);

module.exports = router;
