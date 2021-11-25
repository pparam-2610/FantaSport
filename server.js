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
mongoose.connect(process.env.DATABASE_URL, { useNewURLParser : true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Importing Routers
const indexRouter = require('./routes/index')

//Using Routers
app.use('/', indexRouter);


//Server Started
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server listening on PORT 3000");
})