const routes = require("express").Router();
const redis = require("redis");
const redisClient = redis.createClient();
const passport = require("passport");
const { jwtOptions } = require("../middlewares/passport").jwt;
const { createUser, getAllUsers, login } = require("../controllers").utils;

routes.get("/", (req, res) => {
  res.status(200).json({ message: "Connected" });
});

routes.get("/users", async (req, res) => {
  const users = await getAllUsers();
  res.status(200).json({ body: users });
});

// Register
routes.post("/register", async (req, res, next) => {
  const { name, password, email, phone } = req.body;
  if ((name, password, email, phone)) {
    const newUser = await createUser({ name, password, email, phone });
    res.status(201).json({ body: newUser });
  } else {
    res.status(400).json({ message: "Incorrect parameters" });
  }
});

// Login
routes.post("/login", async (req, res, next) => {
  const { name, password } = req.body;
  const result = await login(name, password, jwtOptions.secretOrKey);
  if (result === 204) {
    res.status(204).json({ message: "No such user found" });
  } else if (result === 401) {
    res.status(401).json({ message: "Invalid password" });
  } else if (result === 400) {
    res.status(400).json({ message: "Incorrect parameters" });
  } else {
    req.session.userId = result.user.id;
    req.session.sessionId = req.session.id;
    res.json({
      userId: req.session.userId,
      sessionId: req.session.sessionId,
      token
    });
  }
});

// Authentication needed
routes.get(
  "/private",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const key = `sess:${req.session.sessionId}`;
    const cookies = req.signedCookies._wematch;

    redisClient.get(key, (err, response) => {
      if (response) {
        const values = JSON.parse(response);
        if (values.sessionId === cookies) {
          res.json({ message: "Authorized user successfully" });
        } else
          res.json({
            message: "Failed to authorize user: different session id"
          });
      } else {
        res.json({ message: "Key doesn't exist" });
      }
    });
  }
);

// Logout
routes.get("/logout", (req, res) => {
  // Check if session exists
  if (req.session.sessionId) {
    const key = `sess:${req.session.sessionId}`;
    redisClient.del(key, (err, response) => {
      // Check if Redis was able to delete the key
      if (response == 1) {
        req.session.destroy(() => {
          res.json({ message: "User logged out successfully" });
        });
      } else
        res.status(401).json({ message: `Session doesn't exist in memory` });
    });
  } else {
    res.status(400).json({ message: "Session doesn't exist" });
  }
});

module.exports = routes;
