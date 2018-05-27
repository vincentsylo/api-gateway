export default {
  isAuthenticated: (resolve, root, args, { user }) => {
    if (!user) {
      throw new Error('Unauthenticated');
    }

    return resolve();
  },
};
