const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const passport = require("passport");
const strategy = require("./middlewares/passport").strategy;
const CONFIG = require("./config/config");
const models = require("./models");
const routes = require("./routes");

const app = express();
app.use(logger("dev"));
passport.use(strategy);
app.use(passport.initialize());

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

models.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to SQL database:", CONFIG.db_name);
  })
  .catch(err => {
    console.error("Unable to connect to SQL database:", CONFIG.db_name, err);
  });

if (CONFIG.app === "dev") {
  models.sequelize.sync(); // creates table if they do not already exist
  // models.sequelize.sync({ force: true });
  // deletes and then recreates all tables
}

app.use(cors());
app.use("/", routes);

app.listen(3000, () => {
  console.log("Running on port 3000...");
});
