const Sequelize = require("sequelize");
const secrets = require("../config/secrets");

const db = {};

// Initialze an instance of Sequelize
const sequelize = new Sequelize({
  database: secrets[process.env.NODE_ENV]["rdsConfig"].database,
  username: secrets[process.env.NODE_ENV]["rdsConfig"].username,
  password: secrets[process.env.NODE_ENV]["rdsConfig"].password,
  dialect: "mysql",
  logging: false
});

sequelize
  .authenticate()
  .then(() =>
    console.log(
      "Connected to:",
      secrets[process.env.NODE_ENV]["rdsConfig"].database
    )
  )
  .catch(err =>
    console.error(
      "Unable to connect to:",
      secrets[process.env.NODE_ENV]["rdsConfig"].database,
      err
    )
  );

const User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING,
    validate: {
      len: { args: [7, 20], message: "Phone number invalid, too short." },
      isNumeric: { message: "not a valid phone number." }
    }
  }
});

User.sync() // sync({ force: true }) deletes and then recreates all tables
  .then(() => console.log("Synced DB"))
  .catch(err => console.log("Invalid DB credentials"));

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;

module.exports = db;
