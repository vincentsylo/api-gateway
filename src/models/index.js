import Sequelize from 'sequelize';
import _ from 'lodash';

const sequelize = new Sequelize(
  `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: Sequelize.Op,
  },
);

const models = {
  user: sequelize.import('./user/index.js'),
};

_.each(models, (model, key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
