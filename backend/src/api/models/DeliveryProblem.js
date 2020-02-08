import Sequelize, { Model } from 'sequelize';

import Deliveryman from './Deliveryman';
import File from './File';
import Merchandise from './Merchandise';
import Recipient from './Recipient';

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        tableName: 'delivery_problems',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Merchandise, {
      foreignKey: 'delivery_id',
      as: 'delivery',
    });
  }

  static async getAll() {
    return this.findAll({
      attributes: ['id', 'description'],
      include: {
        model: Merchandise,
        as: 'delivery',
        attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id', 'name', 'address'],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          },
        ],
      },
    });
  }

  static async getById(id) {
    return this.findByPk(id, {
      attributes: ['id', 'description'],
      include: {
        model: Merchandise,
        as: 'delivery',
        attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id', 'name', 'address'],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          },
        ],
      },
    });
  }

  static async getByDeliveryId(id) {
    return this.findOne({
      where: { delivery_id: id },
      attributes: ['id', 'description'],
      include: {
        model: Merchandise,
        as: 'delivery',
        attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: ['id', 'name', 'address'],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          },
        ],
      },
    });
  }
}

export default DeliveryProblem;
