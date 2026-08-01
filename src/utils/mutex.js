export class Mutex {
  #current = Promise.resolve();

  async runExclusive(task) {
    const previous = this.#current;
    let release;
    this.#current = new Promise((resolve) => { release = resolve; });
    await previous;
    try {
      return await task();
    } finally {
      release();
    }
  }
}
