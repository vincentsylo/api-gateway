import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

const generateAccessToken = user => (
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
);

export default {
  registerUser: async (models, args) => {
    // TODO: Add recaptcha
    try {
      const { email, password } = args;

      const existingUser = await models.user.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists.');
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await models.user.create({ email, hash });
      if (user) {
        return user;
      }

      throw new Error('Something went wrong.');
    } catch (err) {
      throw new Error(err);
    }
  },

  login: async (models, email, password) => {
    try {
      const foundUser = await models.user.findOne({
        where: { email },
        attributes: ['id', 'hash'],
      });
      const success = await bcrypt.compare(password, foundUser.hash);
      if (!success) {
        throw new Error('Login failed.');
      }

      if (foundUser) {
        const accessToken = generateAccessToken(foundUser);
        const refreshToken = uuid.v4();

        await models.user.update(
          { refreshToken },
          { where: { id: foundUser.id } },
        );

        return { accessToken, refreshToken };
      }

      throw new Error('Login failed.');
    } catch (err) {
      throw new Error(err);
    }
  },

  refreshAccessToken: async (models, jwtPayload, refreshToken) => {
    if (!refreshToken || !jwtPayload) {
      throw new Error('Unauthenticated.');
    }

    try {
      const { id: userId } = jwtPayload;
      const user = await models.user.findOne({
        where: { id: userId, refreshToken },
        attributes: ['id'],
      });

      if (user) {
        return { accessToken: generateAccessToken(user) };
      }

      throw new Error('Something went wrong.');
    } catch (err) {
      throw new Error(err);
    }
  },
};
