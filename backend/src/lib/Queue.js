import Bee from 'bee-queue';

import DeliveryCancellationMail from '../api/jobs/DeliveryCancellationMail';
import NewDeliveryMail from '../api/jobs/NewDeliveryMail';
import redisConfig from '../config/redis';

const jobs = [NewDeliveryMail, DeliveryCancellationMail];

class Queue {
  constructor() {
    (this.queues = {}), this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.onFailed).process(handle);
    });
  }

  onFailed(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
