if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//Requiring npm modules
const express = require("express");
const app = express();
const path = require("path");

//Setting paths and dependencies
// app.set("view-engine", "ejs");
// app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./public/views"));
app.use(express.static("public"));

//Database Connection
const mongoose = require("mongoose");

//Importing Routers
const indexRouter = require("./routes/index");
const leaguesRouter = require("./routes/leagues");
const teamsRouter = require("./routes/teams");
const userRouter = require("./routes/user");

//Using Routers
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
