const express = require("express");
const session = require("express-session");
const secrets = require("./config/secrets");
const passport = require("passport");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const redis = require("redis");
const redisClient = redis.createClient();
const redisStore = require("connect-redis")(session);
const { jwtStrategy } = require("./middlewares/passport").jwt;
const routes = require("./routes");

const app = express();
const environ = process.env.NODE_ENV;

// Setup logger
app.use(logger("dev"));
// Parse application/json
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parser cookies
app.use(cookieParser(secrets[environ].secret));

redisClient.on("connect", err => {
  console.log("Connected to Redis");
});
redisClient.on("error", error => {
  console.log("Redis error: ", error);
});

app.use(
  session({
    secret: secrets[environ].secret, // the session ID hash (==cookie_id==redis_key_value)
    name: secrets[environ]["redisConfig"].options.cookieId,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS is needed for secure: true
    store: new redisStore({
      host: secrets[environ]["redisConfig"].options.host,
      port: secrets[environ]["redisConfig"].options.port,
      client: redisClient,
      ttl: secrets[environ]["redisConfig"].options.ttl // the session expiration time in seconds
    })
  })
);

passport.use(jwtStrategy);
app.use(passport.initialize());

app.use(cors());
app.use("/", routes);

const PORT =
  environ === "development" ? 3000 : environ === "production" ? 3001 : 3002;

app.listen(PORT, () => {
  if (environ == "production") {
    console.log("Production Mode");
  } else if (environ == "development") {
    console.log("Development Mode");
  } else {
    console.log("Weird Mode");
  }
  console.log(`Running on port ${PORT}...`);
});
