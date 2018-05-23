import passport from 'passport';
import passportJwt from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import models from './models';

export const getJwtPayload = user => ({
  id: user.id,
});

export default () => {
  const { ExtractJwt, Strategy: JwtStrategy } = passportJwt;

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await models.user.findOne({
        where: { email },
        attributes: ['id', 'hash'],
      });
      const success = await bcrypt.compare(password, user.hash);
      if (!success) {
        return done(null, false);
      }

      const jwtPayload = getJwtPayload(user);
      return done(null, jwtPayload);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: true,
  }, async (jwtPayload, done) => {
    try {
      const currentTime = new Date().getTime() / 1000;

      if (currentTime > jwtPayload.exp) {
        console.log('Expired!', currentTime, jwtPayload.exp);
        return done(null, false);
      }

      return done(null, jwtPayload);
    } catch (err) {
      return done(err);
    }
  }));
};
