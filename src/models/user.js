export default (sequelize, DataTypes) => (
  sequelize.define('user', {
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
  })
);
