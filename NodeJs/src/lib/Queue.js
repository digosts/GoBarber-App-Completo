import Bee from 'bee-queue';

// import CancellationMail from '../app/jobs/CancellationMail';
// import configRedis from '../config/redis';

// const jobs = [CancellationMail];
const jobs = [];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  /**
   * Para cada Job, criamos uma fila e armazenamos o Bee e nosso handle
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          // redis: configRedis,
        }),
        handle,
      };
    });
  }

  /**
   * Sempre que tiver uma nova adição de jobs no Redis o processQueue vai entrar em ação
   * e processar dentro de background
   * @param {*} queue
   * @param {*} job
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Vai pegar basicamente cada um desse job, e ficar processando em tempo real...
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.tron.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
