import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.JSONB,
        street: Sequelize.VIRTUAL,
        number: Sequelize.VIRTUAL,
        complement: Sequelize.VIRTUAL,
        state: Sequelize.VIRTUAL,
        city: Sequelize.VIRTUAL,
        zipCode: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async recipient => {
      const {
        address,
        street,
        number,
        complement,
        state,
        city,
        zipCode,
      } = recipient;

      recipient.address = {
        street: street || address.street,
        number: number || address.number,
        complement: complement || address.complement,
        state: state || address.state,
        city: city || address.city,
        zipCode: zipCode || address.zipCode,
      };
    });

    return this;
  }
}

export default Recipient;
