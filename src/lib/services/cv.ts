import { digit } from "../utils/sudoku";

type Status =
  | ["error", Event]
  | ["done", MessageEvent]
  | ["loading", undefined];

type MessageType = "load" | "sudokuProcessing" | "imageProcessing";

type SudokuEventData = { payload: ImageData; predictions: digit[][] };

class CV {
  private worker: Worker | undefined;
  private _status: Map<MessageType, Status>;
  private loaded: boolean = false;

  constructor() {
    this._status = new Map();
    this.worker = new Worker("/js/worker.js"); // load worker
    // Capture events and save [status, event] inside the _status object
    this.worker.onmessage = (ev: MessageEvent<{ msg: MessageType }>) => {
      console.debug("Received message from worker", ev);

      if (ev.data.msg === "load") {
        this.loaded = true;
      }

      this._status.set(ev.data.msg, ["done", ev]);
    };

    this.worker.onerror = (e) => {
      this._status.set(e.message as MessageType, ["error", e]);
      console.debug(e);
    };
  }

  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  _dispatch<T>(event: {
    msg: MessageType;
    data?: any;
  }): Promise<MessageEvent<T>> {
    const { msg } = event;
    if (this._status.get(msg)) {
      // we already posted this message and worker is busy right now, what do we do with it?
    }

    this._status.set(msg, ["loading", undefined]);
    if (this.worker) {
      console.debug("Dispatching event to Serviceworker", event);
      this.worker.postMessage(event);
    }
    return new Promise<MessageEvent>((res, rej) => {
      const interval = setInterval(() => {
        console.debug("checking");
        const result = this._status.get(msg);
        if (result === undefined)
          return rej("Message got lost, what happened?");
        const [state, event] = result;
        switch (state) {
          case "done": {
            this._status.delete(msg);
            clearInterval(interval);
            return res(event);
          }
          case "error": {
            this._status.delete(msg);
            clearInterval(interval);
            return rej(event);
          }
        }
      }, 50);
    });
  }

  load() {
    if (!this.loaded) {
      return this._dispatch({ msg: "load" });
    }
    return Promise.resolve();
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
    return this._dispatch<SudokuEventData>({
      msg: "sudokuProcessing",
      data: payload,
    });
  }
}

const cv = new CV();

// Export the same instant everywhere
export default cv;
