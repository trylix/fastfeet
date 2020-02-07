import Sequelize from 'sequelize';
import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll({
      attributes: ['id', 'name', 'address'],
    });

    return res.json(recipients);
  }

  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id, {
      attributes: ['id', 'name', 'address'],
    });

    if (!recipient) {
      return res.status(401).json({ error: `Recipient does not exist.` });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      complement: Yup.string(),
      zipCode: Yup.string()
        .required()
        .min(8)
        .max(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Verification fields failed.' });
    }

    const { name, street, number, state, city, zipCode } = req.body;

    const recipientExists = await Recipient.findOne({
      where: Sequelize.literal(`name = '${name}' AND address @> '{
      "city": "${city}",
      "state": "${state}",
      "number": "${number}",
      "street": "${street}",
      "zip_code": "${zipCode}"
      }'`),
    });

    if (recipientExists) {
      return res.status(401).json({ error: 'Recipient already exists' });
    }

    const { id, address } = await Recipient.create(req.body);

    return res.json({ id, name, address });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      complement: Yup.string(),
      zipCode: Yup.string()
        .min(8)
        .max(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Verification fields failed.' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exist.' });
    }

    const { id, name, address } = await recipient.update(req.body);

    return res.json({ id, name, address });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exist.' });
    }

    await recipient.destroy();

    return res.status(200).json();
  }
}

export default new RecipientController();
