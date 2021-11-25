const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.send('Hello Bhushan')
})

router.get('/profile', (req,res) => {
    res.send('Profile Details Here')
})

router.get('/stages', (req,res) => {
    res.send('All Stages (Isme se select karke create league karega banda)')
})

router.get('/upcoming', (req,res) => {
    res.send('Idhar upcoming matches pel sakte hai which will redirect to its respective league')
})

module.exports = router;