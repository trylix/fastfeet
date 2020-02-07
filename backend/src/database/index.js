import Sequelize from 'sequelize';

import Deliveryman from '../api/models/Deliveryman';
import File from '../api/models/File';
import Recipient from '../api/models/Recipient';
import User from '../api/models/User';
import databaseConfig from '../config/database';

const models = [User, Recipient, File, Deliveryman];

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
