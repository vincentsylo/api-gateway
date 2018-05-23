import { makeExecutableSchema } from 'graphql-tools';

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

const typeDefs = `
  type Query { books(limit: Int): [Book] }
  type Book { title: String, author: String }
`;

const resolvers = {
  Query: { books: (root, args) => args && args.limit ? books.slice(0, args.limit) : books },
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
