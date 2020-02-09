/* eslint-disable eqeqeq */
import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';
import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Deliveryman from '../models/Deliveryman';
import Merchandise from '../models/Merchandise';
import Recipient from '../models/Recipient';

class MerchandiseController {
  async index(req, res) {
    const merchandises = await Merchandise.getAll();

    return res.json(merchandises);
  }

  async show(req, res) {
    const merchandise = await Merchandise.getById(req.params.id);

    if (!merchandise) {
      return res.status(401).json({ error: 'Merchandise does not exist.' });
    }

    return res.json(merchandise);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fields failed.' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(401).json({ error: 'Recipient does not exists.' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exists.' });
    }

    const merchandise = await Merchandise.create(req.body);

    await Queue.add(NewDeliveryMail.key, {
      merchandise,
      recipient,
      deliveryman,
      url: process.env.APP_URL,
    });

    const { id, product } = merchandise;

    return res.json({ id, recipient_id, deliveryman_id, product });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      repicient_id: Yup.number(),
      deliveryman_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fields failed.' });
    }

    const { id } = req.params;

    const merchandise = await Merchandise.getById(id);

    if (!merchandise) {
      return res.status(400).json({ error: 'Merchandise does not exists.' });
    }

    if (merchandise.canceled_at) {
      return res.status(401).json({
        error: `That merchandise has been canceled at ${merchandise.canceled_at}.`,
      });
    }

    const { recipient_id, deliveryman_id } = req.body;

    if (recipient_id && recipient_id != merchandise.recipient.id) {
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (!recipientExists) {
        return res.status(401).json({ error: 'Recipient does not exists.' });
      }
    }

    if (deliveryman_id && deliveryman_id != merchandise.deliveryman.id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (!deliverymanExists) {
        return res.status(401).json({ error: 'Delivery man does not exists.' });
      }
    }

    const updatedMerchandise = await merchandise.update(req.body);

    /*
     * I may or may not update the merchandise details,
     * so I use the returned fields of update method, to ensure
     * the return of all
     */

    return res.json({
      id,
      product: updatedMerchandise.product,
      recipient_id: updatedMerchandise.recipient.id,
      deliveryman_id: updatedMerchandise.deliveryman.id,
    });
  }

  async delete(req, res) {
    const merchandise = await Merchandise.getById(req.params.id);

    if (!merchandise) {
      return res.status(401).json({ error: 'Merchandise does not exist.' });
    }

    if (!merchandise.canceled_at) {
      merchandise.canceled_at = new Date();

      await Queue.add(DeliveryCancellationMail.key, {
        merchandise,
        recipient: merchandise.recipient,
        deliveryman: merchandise.deliveryman,
      });
    }

    await merchandise.destroy();

    return res.status(200).json();
  }
}

export default new MerchandiseController();
