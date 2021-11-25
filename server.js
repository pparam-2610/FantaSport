if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//Requiring npm modules
const express = require('express')
const app = express()

//Setting paths and dependencies
app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static('public'))

//Database Connection
const mongoose = require('mongoose')

//Importing Routers
const indexRouter = require('./routes/index')
const leaguesRouter = require('./routes/leagues')
const teamsRouter = require('./routes/teams')

//Using Routers
app.use('/', indexRouter);
app.use('/leagues', leaguesRouter)
app.use('/teams', teamsRouter)

//Server Started
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server listening on PORT 3000");

    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err))
})