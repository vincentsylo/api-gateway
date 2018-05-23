import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.get('/profile', (req, res) => {
  res.send(req.user);
});

export default router;
