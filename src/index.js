import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import models from './models';
import schema from './schema';

const app = express();

app.use(compression());

app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  cacheControl: true,
}));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.get('/', (req, res) => {
  res.send('Hello world!');
});

models.sequelize.sync({}).then(() => {
  app.listen(8081, () => {
    console.log('Server started!');
  });
});
