import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    hash: {
      type: DataTypes.STRING,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExpiry: {
      type: DataTypes.DATE,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  }, {
    paranoid: true,
    timestamps: true,
  });

  User.registerUser = async (models, args) => {
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
  };

  User.generateAccessToken = user => (
    jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  );

  User.login = async (models, email, password) => {
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
        const accessToken = User.generateAccessToken(foundUser);
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
  };

  User.refreshAccessToken = async (models, userId, refreshToken) => {
    try {
      const user = await models.user.findOne({
        where: { id: userId, refreshToken },
        attributes: ['id'],
      });

      if (user) {
        return { accessToken: User.generateAccessToken(user) };
      }

      throw new Error('Something went wrong.');
    } catch (err) {
      throw new Error(err);
    }
  };

  return User;
};
