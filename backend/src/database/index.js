import Sequelize from 'sequelize';

import User from '../api/models/User';
import databaseConfig from '../config/database';

const models = [User];

class Database {
  constructor() {
    this.postgres();
  }

  postgres() {
    this.pgConnection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.pgConnection))
      .map(
        model => model.associate && model.associate(this.pgConnection.models)
      );
  }
}

export default new Database();
