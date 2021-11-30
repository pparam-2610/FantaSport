const express = require('express')
const router = express.Router()

const leagueController = require('../controllers/leagues')
const teamController = require('../controllers/teams')

router.get("/", teamController.displayAllTeams)

router.get("/:teamId", teamController.displayTeam)

// router.get("/calculatePoints")

module.exports = router;