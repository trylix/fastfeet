import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';
import Merchandise from '../models/Merchandise';

class DeliveryProblemController {
  async index(req, res) {
    const deliveries = await DeliveryProblem.getAll();

    return res.json(deliveries);
  }

  async show(req, res) {
    const problems = await DeliveryProblem.getByDeliveryId(req.params.id);

    if (!problems) {
      return res
        .status(400)
        .json({ error: 'No problems found for this delivery.' });
    }

    return res.json(problems);
  }

  async store(req, res) {
    const { id } = req.params;

    const { deliveryman_id, description } = req.body;

    const deliveryman = await Deliveryman.getById(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man not exists.' });
    }

    const merchandise = await Merchandise.getById(id);

    if (!merchandise) {
      return res.status(400).json({ error: 'Merchandise not exists.' });
    }

    if (merchandise.deliveryman.id !== deliveryman.id) {
      return res
        .status(401)
        .json({ error: 'This merchandise is not registered for you.' });
    }

    if (merchandise.canceled_at || merchandise.end_date) {
      return res.status(401).json({ error: 'Delivery already finished.' });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: id,
      description,
    });

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
