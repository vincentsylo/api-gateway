export default {
  Query: {
    profile: (root, args, { models, user }) => models.user.findOne({ where: { id: user.id } }),
  },
  Mutation: {
    registerUser: (root, args, { models }) => models.user.actions.registerUser(models, args),
    login: (root, args, { models }) => models.user.actions.login(models, args.email, args.password),
    refreshAccessToken: (root, { refreshToken }, { models, jwtPayload }) => {
      if (!refreshToken || !jwtPayload) {
        throw new Error('Unauthenticated.');
      }

      models.user.actions.refreshAccessToken(models, jwtPayload.id, refreshToken);
    },
  },
};
