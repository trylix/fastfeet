import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { merchandise, recipient, deliveryman, url } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Ei, você possui uma nova entrega!`,
      template: 'newDelivery',
      context: {
        deliveryman,
        recipient,
        merchandise,
        url,
      },
    });
  }
}

export default new NewDeliveryMail();
