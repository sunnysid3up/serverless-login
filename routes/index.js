const routes = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const jwtOptions = require("../middlewares/passport").options;
const utils = require("../controllers");

routes.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

routes.get("/users", async (req, res) => {
  const users = await utils.getAllUsers();
  res.status(200).json({ body: users });
});

// Register
routes.post("/register", async (req, res, next) => {
  const { name, password, email, phone } = req.body;
  const newUser = await utils.createUser({ name, password, email, phone });
  res.status(201).json({ body: newUser });
});

// Login
routes.post("/login", async (req, res, next) => {
  const { name, password } = req.body;
  if (name && password) {
    const user = await utils.getUser({ name });
    if (!user) {
      res.status(401).json({ message: "No such user found" });
    }
    if (user.password === password) {
      // from now on we'll identify the user by the id and the id is the
      // only personalized value that goes into our token
      const payload = { id: user.id };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ token: token });
    } else {
      res.status(401).json({ message: "Password is incorrect" });
    }
  }
});

// Authentication needed
routes.get(
  "/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json("Success! You can now see this without a token.");
  }
);

module.exports = routes;
