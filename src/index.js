import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import passport from 'passport';
import initializePassport from './passport';
import models from './models';
import schema from './schema';
import authApi from './api/auth';
import userApi from './api/user';

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
initializePassport();

app.use('/graphql', graphqlExpress({ schema, cacheControl: true }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.get('/', (req, res) => {
  res.send('Hello world!');
});
app.use('/api/auth', authApi);
app.use('/api/user', passport.authenticate('jwt', { session: false }), userApi);

app.use((req, res, next) => {
  const error = new Error('Page not found.');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500).send(error);
});

models.sequelize.sync({ force: false }).then(() => {
  app.listen(8081, () => {
    console.log('Server started!');
  });
});
