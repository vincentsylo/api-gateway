export default {
  isAuthenticated: (resolve, source, args, { user }) => {
    if (!user) {
      throw new Error('Unauthenticated');
    }

    return resolve();
  },
};
