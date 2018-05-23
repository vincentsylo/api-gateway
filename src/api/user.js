import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/profile', (req, res, next) => {
  res.send(req.user);
});

export default router;
