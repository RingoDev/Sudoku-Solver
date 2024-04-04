class CV {
  private worker: Worker | undefined;
  private _status: Map<string, [string, MessageEvent | ErrorEvent | undefined]>;
  private loaded: boolean = false;

  constructor() {
    this._status = new Map();
    // this.worker = new Worker('/js/worker.js') // load worker
    // // Capture events and save [status, event] inside the _status object
    // this.worker.onmessage = (e) => {
    //     console.debug("Worker got a message", e)
    //     if (e.data.error) {
    //         (this._status.set(e.data.msg, ['error', e]));
    //     } else {
    //         if (e.data.msg === 'load') {
    //             this.loaded = true;
    //         }
    //         (this._status.set(e.data.msg, ['done', e]));
    //     }
    //     console.debug(e);
    // }
    // this.worker.onerror = (e) => {
    //     (this._status.set(e.message, ['error', e]));
    //     console.debug(e);
    // }
  }

  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  _dispatch(event: { msg: string; data?: any }) {
    const { msg } = event;
    if (this._status.get(msg)) {
      // we already posted this message and worker is busy right now, what do we do with it?
    }
    this._status.set(msg, ["loading", undefined]);
    if (this.worker) {
      console.debug("Dispatching event to Serviceworker", event);
      this.worker.postMessage(event);
    }
    return new Promise<MessageEvent | ErrorEvent | undefined>((res, rej) => {
      let interval = setInterval(() => {
        const status = this._status.get(msg);
        if (status) {
          if (status[0] === "done") res(status[1]);
          if (status[0] === "error") rej(status[1]);
          if (status[0] !== "loading") {
            this._status.delete(msg);
            clearInterval(interval);
          }
        }
      }, 50);
    });
  }

  /**
   * we are going to call the 'load' event, as we've just
   */
  load() {
    if (!this.loaded) {
      return this._dispatch({ msg: "load" });
    }
  }

  /**
   * We are going to use the _dispatch event we created before to
   * call the postMessage with the msg and the image as payload.
   *
   * Thanks to what we've implemented in the _dispatch, this will
   * return a promise with the processed image.
   */
  imageProcessing(payload: ImageData) {
    return this._dispatch({ msg: "imageProcessing", data: payload });
  }

  sudokuProcessing(payload: ImageData) {
    return this._dispatch({ msg: "sudokuProcessing", data: payload });
  }
}

const cv = new CV();

// Export the same instant everywhere
export default cv;
