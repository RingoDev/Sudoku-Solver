class CV {
    private worker: Worker | undefined;
    private _status: Map<string, [string, MessageEvent | ErrorEvent | undefined]>;


    constructor() {
        this._status = new Map();
        this.worker = new Worker('/js/worker.js') // load worker

    }

    /**
     * We will use this method privately to communicate with the worker and
     * return a promise with the result of the event. This way we can call
     * the worker asynchronously.
     */
    _dispatch(event: { msg: string, data?: any }) {
        const {msg} = event
        this._status.set(msg, ['loading', undefined])
        if (this.worker) {
            console.debug("Dispatching event to Serviceworker", event)
            this.worker.postMessage(event)
        }
        return new Promise<MessageEvent | ErrorEvent | undefined>((res, rej) => {
            let interval = setInterval(() => {
                const status = this._status.get(msg)
                if (status) {
                    if (status[0] === 'done') res(status[1])
                    if (status[0] === 'error') rej(status[1])
                    if (status[0] !== 'loading') {
                        this._status.delete(msg)
                        clearInterval(interval)
                    }
                }
            }, 50)
        })
    }

    /**
     * First, we will load the worker and capture the onmessage
     * and onerror events to always know the status of the event
     * we have triggered.
     *
     * Then, we are going to call the 'load' event, as we've just
     * implemented it so that the worker can capture it.
     */
    load() {
        if (this.worker) {
            // Capture events and save [status, event] inside the _status object
            this.worker.onmessage = (e) => {
                (this._status.set(e.data.msg, ['done', e]));
                console.log(e);
            }
            this.worker.onerror = (e) => {
                (this._status.set(e.message, ['error', e]));
                console.log(e);
            }
        }
        return this._dispatch({msg: 'load'})
    }

    /**
     * We are going to use the _dispatch event we created before to
     * call the postMessage with the msg and the image as payload.
     *
     * Thanks to what we've implemented in the _dispatch, this will
     * return a promise with the processed image.
     */
    imageProcessing(payload: ImageData) {
        return this._dispatch({msg: 'imageProcessing', data: payload})
    }

    sudokuProcessing(payload: ImageData) {
        return this._dispatch({msg: 'sudokuProcessing', data: payload})
    }
}

// Export the same instant everywhere
export default new CV()
