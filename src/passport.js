import passport from 'passport';
import passportJwt from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
// import models from './models';

const { ExtractJwt, Strategy: JwtStrategy } = passportJwt;

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, cb) => {
  try {
    // const user = await models.user.findOne({ email, password });
    const user = { email: 'test', password: 'test' };

    if (!user) {
      return cb(null, false);
    }

    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, cb) => {
  try {
    // const user = await models.user.findById(jwtPayload.id);
    const user = { email: 'test', password: 'test' };
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));
