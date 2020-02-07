import Sequelize, { Model } from 'sequelize';

import File from './File';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  static async getAll() {
    return this.findAll({
      attributes: ['id', 'name', 'email'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });
  }

  static async getById(id) {
    return this.findByPk(id, {
      attributes: ['id', 'name', 'email'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['name', 'path', 'url'],
      },
    });
  }
}

export default Deliveryman;
