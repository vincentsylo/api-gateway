const authenticatedRequest = (user, next) => {
  if (user) return next();
  throw new Error('Unauthenticated.');
};

export default {
  Query: {
    profile: (root, args, { models, user }) => (
      authenticatedRequest(user, () => models.user.findOne({ where: { id: user.id } }))
    ),
  },
  Mutation: {
    registerUser: (root, args, { models }) => models.user.actions.registerUser(models, args),
    login: (root, args, { models }) => models.user.actions.login(models, args.email, args.password),
    refreshAccessToken: (root, args, { models, jwtPayload }) => {
      const { id } = jwtPayload;
      return id ? models.user.actions.refreshAccessToken(models, id, args.refreshToken) : null;
    },
  },
};
