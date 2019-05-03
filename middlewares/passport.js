const passportJWT = require("passport-jwt");
const CONFIG = require("../config/config");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = CONFIG.jwt_encryption;

// lets create our strategy for web token
const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
  console.log("payload received", jwt_payload);
  const user = getUser({ id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

module.exports = { options: jwtOptions, strategy };
