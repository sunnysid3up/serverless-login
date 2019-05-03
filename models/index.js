const Sequelize = require("sequelize");
const CONFIG = require("../config/config");

const db = {};

// initialze an instance of Sequelize
const sequelize = new Sequelize({
  database: CONFIG.db_name,
  username: CONFIG.db_user,
  password: CONFIG.db_password,
  dialect: "mysql",
  logging: false
});

// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log("Connected to:", CONFIG.db_name))
  .catch(err => console.error("Unable to connect to:", CONFIG.db_name, err));

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

User.sync()
  .then(() => console.log({ message: "Authenticated DB connection" }))
  .catch(err => console.log({ message: "invalid DB credentials" }));

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;

module.exports = db;
