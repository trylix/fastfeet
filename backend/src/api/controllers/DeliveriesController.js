import { startOfDay, endOfDay, getHours } from 'date-fns';
import { Op } from 'sequelize';
import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Merchandise from '../models/Merchandise';

class DeliveriesController {
  async index(req, res) {
    const schema = Yup.object().shape({
      filter: Yup.string().oneOf(['pending', 'delivered']),
    });

    if (!(await schema.isValid(req.query))) {
      return res.status(400).json({ error: 'Validation fields failed.' });
    }

    const { deliverymanId } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(deliverymanId);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Delivery man not exists. ' });
    }

    const { filter = 'pending', page = 1 } = req.query;

    const search = {
      pending: async limit => {
        const results = await Merchandise.pending(deliverymanId, page, limit);

        return results;
      },
      delivered: async limit => {
        const results = await Merchandise.delivered(deliverymanId, page, limit);

        return results;
      },
    };

    const deliveries = await search[filter](20);

    return res.json(deliveries);
  }

  async show(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man not exists. ' });
    }

    const merchandise = await Merchandise.getById(deliveryId);

    if (!merchandise) {
      return res.status(401).json({ error: 'Merchandise not exists.' });
    }

    if (deliveryman.id !== merchandise.deliveryman.id) {
      return res
        .status(401)
        .json({ error: 'This merchandise is not registered for you.' });
    }

    if (merchandise.canceled_at) {
      return res.status(401).json({
        error: `That merchandise has been canceled at ${merchandise.canceled_at}.`,
      });
    }

    return res.json(merchandise);
  }

  async store(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man not exists. ' });
    }

    const merchandise = await Merchandise.getById(deliveryId);

    if (!merchandise) {
      return res.status(401).json({ error: 'Merchandise not exists.' });
    }

    if (deliveryman.id !== merchandise.deliveryman.id) {
      return res
        .status(401)
        .json({ error: 'This merchandise is not registered for you.' });
    }

    if (merchandise.canceled_at) {
      return res.status(401).json({
        error: `That merchandise has been canceled at ${merchandise.canceled_at}.`,
      });
    }

    if (merchandise.end_date) {
      return res.status(401).json({
        error: 'Delivery has already been completed.',
      });
    }

    if (merchandise.start_date) {
      return res.status(401).json({
        error: 'You already started this delivery',
      });
    }

    const date = new Date();
    const currentHour = getHours(date);

    if (!(currentHour >= 8 && currentHour < 19)) {
      return res.status(401).json({ error: 'Outside working hours.' });
    }

    const { count } = await Merchandise.findAndCountAll({
      where: {
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (count >= 5) {
      return res
        .status(401)
        .json({ error: 'The deliveries limit by day has been reached' });
    }

    const delivery = await merchandise.update({ start_date: date });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      originalname: Yup.string().required(),
      filename: Yup.string().required(),
    });

    if (!(await schema.isValid(req.file))) {
      return res.status(401).json({
        error: "You need the recipient's signature to end this delivery.",
      });
    }

    const { deliverymanId, deliveryId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man not exists. ' });
    }

    const merchandise = await Merchandise.getById(deliveryId);

    if (!merchandise) {
      return res.status(401).json({ error: 'Merchandise not exists.' });
    }

    if (deliveryman.id !== merchandise.deliveryman.id) {
      return res
        .status(401)
        .json({ error: 'This merchandise is not registered for you.' });
    }

    if (merchandise.canceled_at) {
      return res.status(401).json({
        error: `That merchandise has been canceled at ${merchandise.canceled_at}.`,
      });
    }

    if (merchandise.end_date) {
      return res.status(401).json({
        error: 'Delivery has already been completed.',
      });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const date = new Date();

    await merchandise.update({ end_date: date, signature_id: file.id });

    return res.status(200).json();
  }
}

export default new DeliveriesController();
