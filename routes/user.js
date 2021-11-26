const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // res.send('Hello Bhushan')
  res.render("profile");
});

router.post("/signup", (req, res) => {
  // res.send('Hello Bhushan')
  res.render("index");
});

router.post("/login", (req, res) => {
  res.send("Profile Details Here");
});

module.exports = router;
