import DeliveryProblem from '../models/DeliveryProblem';
import Merchandise from '../models/Merchandise';

class CancelDeliveryController {
  async delete(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.getById(id);

    if (!problem) {
      return res.status(400).json({ error: 'Problem not found.' });
    }

    const merchandise = await Merchandise.getById(problem.delivery.id);

    if (!merchandise) {
      return res.status(400).json({ error: 'Merchandise not exists.' });
    }

    if (merchandise.canceled_at || merchandise.end_date) {
      return res.status(401).json({ error: 'Delivery already finished.' });
    }

    merchandise.canceled_at = new Date();

    await merchandise.save();

    // send email

    return res.json(merchandise);
  }
}

export default new CancelDeliveryController();
