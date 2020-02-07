import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

const models = [];

class Database {
  constructor() {
    this.postgres();
  }

  postgres() {
    this.pgConnection = new Sequelize(databaseConfig.sequelize);

    models
      .map(model => model.init(this.pgConnection))
      .map(model => model.associate && model.associate(this.pgConnection.models));
  }
}

export default new Database();