import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';

const types = fileLoader(path.join(__dirname, './*.graphql'));
const resolvers = fileLoader(path.join(__dirname, './*.resolvers.js'));

export default makeExecutableSchema({
  typeDefs: mergeTypes(types, { all: true }),
  resolvers: mergeResolvers(resolvers),
});

