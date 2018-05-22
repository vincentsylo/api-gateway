import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import models from './models';

// Some fake data
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books(limit: Int): [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
  Query: { books: (root, args) => args && args.limit ? books.slice(0, args.limit) : books },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use(compression());

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema,
  cacheControl: true,
}));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.get('/', (req, res) => {
  res.send('Hello world!');
});

models.sequelize.sync({}).then(() => {
  app.listen(8081, () => {
    console.log('Server started!');
  });
});
