import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import models from './models';
import schema from './schema';

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  '/graphql',
  graphqlExpress((req) => {
    const { authorization } = req.headers;
    const jwtPayload = authorization ? jwt.verify(_.replace(authorization, 'Bearer ', ''), process.env.JWT_SECRET, { ignoreExpiration: true }) : null;
    const currentTime = new Date().getTime() / 1000;
    const user = jwtPayload && currentTime > jwtPayload.exp ? null : jwtPayload;

    return {
      schema,
      context: {
        models,
        jwtPayload,
        user,
      },
    };
  }),
);
app.use(
  '/graphiql',
  graphiqlExpress({ endpointURL: '/graphql' }),
);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

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
    console.log('*** Server started ***'); // eslint-disable-line
  });
});
