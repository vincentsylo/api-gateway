import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { user } = req;

  req.login(user, { session: false }, (err) => {
    if (err) {
      return res.send(err);
    }

    const token = jwt.sign(user, process.env.JWT_SECRET);
    return res.json({ user, token });
  });
});

export default router;
