var path = require("path"),
    passportJWT = require("passport-jwt"),
    ExtractJwt = passportJWT.ExtractJwt,
    JwtStrategy = passportJWT.Strategy,
    jwtOptions = {
      jwtFromRequest : ExtractJwt.fromAuthHeader(),
      secretOrKey : process.env.APP_SECRET
    };


module.exports = function configPassport(passport, User) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
    return null;
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ where : { id : id } }).then(function(user) {
      done(null, user);
      return null;
    }).catch(function(err) {
      done(err, user);
      return null;
    });
  });

  passport.use("authenticate-JWT", new JwtStrategy(jwtOptions, function(jwtPayload, next) {
    User.findOne({ where : { id : jwtPayload.id } }).then(function(user) {
      if (!user) {
        next(null, false);
        return null;
      }

      next(null, user);
      return null;
    }).catch(function(err) {
      next(err);
      return null;
    })
  }));

};
