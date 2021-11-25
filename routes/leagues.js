const express = require('express')
const router = express.Router()

const leagueController = require('../controllers/leagues')

router.get('/', leagueController.displayLeagues);

router.get('/createLeague', (req,res)=>{
    res.send('Creates League ke liye page(if required)')
});

router.post('/createLeague', leagueController.createLeague);

router.get('/createTeam/:leagueCode/:fixtureId', leagueController.displayCreateTeam)

router.post('/createTeam', leagueController.createTeam)

router.get('/:leagueCode', leagueController.leagueLeaderboard)

module.exports = router;