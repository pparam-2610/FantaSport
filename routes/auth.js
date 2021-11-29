const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get("/google",
  passport.authenticate("google", { scope: ["profile","email"] })
);
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:8000" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    res.redirect("http://localhost:8000/leagues");
  });

router.get('/me',(req,res)=>{
  console.log("Checking for user: ",req.user);
  res.json({user:req.user});
})

router.get('/logout',(req,res)=>{
  console.log("Checking for user: ", req.user);
  if(req.user)
    req.logout();
  res.json({user:""});
})

module.exports = router;