import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import uuid from 'uuid';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { getJwtPayload } from '../passport';
import models from '../models';

const router = express.Router();

function generateAccessToken(payload) {
  return jwt.sign(getJwtPayload(payload), process.env.JWT_SECRET, { expiresIn: '1h' });
}

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { user } = req;

  req.login(user, { session: false }, async () => {
    try {
      const token = generateAccessToken(user);
      const refreshToken = uuid.v4();

      await models.user.update(
        { refreshToken },
        { where: { id: user.id } },
      );

      return res.json({ user, token, refreshToken });
    } catch (err) {
      return res.sendStatus(500);
    }
  });
});

router.post('/signup', async (req, res) => {
  // TODO: Add recaptcha
  const { email, password } = req.body;

  try {
    const existingUser = await models.user.findOne({ where: { email } });
    if (existingUser) {
      return res.sendStatus(422);
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await models.user.create({ email, hash });
    if (user) {
      return res.json(user);
    }

    return res.sendStatus(422);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.post('/token', async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { refreshToken } = req.body;

    const decoded = jwt.verify(_.replace(authorization, 'Bearer ', ''), process.env.JWT_SECRET, { ignoreExpiration: true });

    if (decoded) {
      const user = await models.user.findOne({
        where: { id: decoded.id, refreshToken },
        attributes: ['id'],
      });

      if (user) {
        return res.json({ token: generateAccessToken(user) });
      }
    }

    return res.sendStatus(401);
  } catch (err) {
    return res.sendStatus(500);
  }
});

export default router;
