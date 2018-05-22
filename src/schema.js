import { makeExecutableSchema } from 'graphql-tools';

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
export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
