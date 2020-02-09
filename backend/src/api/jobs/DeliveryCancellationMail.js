import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import Mail from '../../lib/Mail';

class DeliveryCancellationMail {
  get key() {
    return 'DeliveryCancellationMail';
  }

  async handle({ data }) {
    const { merchandise, recipient, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Ei, uma de suas entregas foi cancelada.`,
      template: 'deliveryCancellation',
      context: {
        deliveryman,
        recipient,
        date: format(
          parseISO(merchandise.canceled_at),
          "dd 'de' MMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
        merchandise,
      },
    });
  }
}

export default new DeliveryCancellationMail();
