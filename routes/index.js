const express = require("express");
const router = express.Router();

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

router.get("/stages", (req, res) => {
  //   res.send("All Stages (Isme se select karke create league karega banda)");
  res.render("home");
});

router.get("/upcoming", (req, res) => {
  //   res.send(
  //     "Idhar upcoming matches pel sakte hai which will redirect to its respective league"
  //   );
  res.render("upcoming");
});

module.exports = router;
