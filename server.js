if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//Requiring npm modules
const express = require("express");
const session = require("express-session");
const passport = require('passport');
const app = express();
const path = require("path");

//Setting paths and dependencies
// app.set("view-engine", "ejs");
// app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./public/views"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(require('cors')())

//Database Connection
const mongoose = require("mongoose");

//Auth

app.use(session({
  secret: "Chemmer",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/isAuthConfig')(passport);


//Importing Routers
const indexRouter = require("./routes/index");
const leaguesRouter = require("./routes/leagues");
const teamsRouter = require("./routes/teams");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

//Using Routers
app.use("/auth",authRouter);
app.use("/", indexRouter);
app.use("/leagues", leaguesRouter);
app.use("/teams", teamsRouter);
app.use("/user", userRouter);

//Server Started
app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on PORT 3000");

  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected"))
    .catch((err) => console.log(err));
});
