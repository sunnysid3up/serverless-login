const passportJWT = require("passport-jwt");
const secrets = require("../config/secrets");
const { getUser } = require("../controllers").utils;

const jwtOptions = {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secrets[process.env.NODE_ENV].secret,
  expiresIn: "60",
  algorithm: "RS256"
};

// Create strategy for token
const jwtStrategy = new passportJWT.Strategy(
  jwtOptions,
  (jwt_payload, next) => {
    console.log("Received payload: ", jwt_payload);
    const user = getUser({ id: jwt_payload.id });
    if (user) next(null, user);
    else next(null, false);
  }
);

module.exports = {
  jwt: {
    jwtOptions,
    jwtStrategy
  }
};
