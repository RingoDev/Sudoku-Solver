/*eslint-disable*/

let cvReady = false;

/**
 * With OpenCV we have to work with the images as cv.Mat (matrices),
 * so you'll have to transform the ImageData to it.
 */
function imageProcessing(msg, payload) {
    const img = cv.matFromImageData(payload)
    let result = new cv.Mat()

    // This converts the image to a greyscale.
    cv.cvtColor(img, result, cv.COLOR_BGR2GRAY)

    postMessage({msg, payload: imageDataFromMat(result)})
}

/**
 *
 * @param {string} msg
 * @param {ImageData} payload
 *
 * @returns {void}
 */
function sudokuProcessing(msg, payload) {

    const undistorted = preProcessing(payload);

    // try to fetch out single digits
    // Infers 81 cell grid from a square image.

    const squares = getSquares(undistorted.rows);

    const digits = []
    for (let square of squares) {
        digits.push(extractDigit(undistorted, square))
    }

    const result = combineDigits(digits);

    postMessage({msg, payload: imageDataFromMat(result)})

    // clear up our garbage
    undistorted.delete();
    result.delete();
}


/**
 * This function converts again from cv.Mat to ImageData
 * @param mat {cv.Mat}
 * @returns {ImageData}
 */
function imageDataFromMat(mat) {
    // converts the mat type to cv.CV_8U
    const img = new cv.Mat()
    const depth = mat.type() % 8
    const scale =
        depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0
    const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0
    mat.convertTo(img, cv.CV_8U, scale, shift)

    // converts the img type to cv.CV_8UC4
    switch (img.type()) {
        case cv.CV_8UC1:
            cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA)
            break
        case cv.CV_8UC3:
            cv.cvtColor(img, img, cv.COLOR_RGB2RGBA)
            break
        case cv.CV_8UC4:
            break
        default:
            throw new Error(
                'Bad number of channels (Source image must have 1, 3 or 4 channels)'
            )
    }
    const clampedArray = new ImageData(
        new Uint8ClampedArray(img.data),
        img.cols,
        img.rows
    )
    img.delete()
    return clampedArray
}

/**
 * This exists to capture all the events that are thrown out of the worker
 * into the worker. Without this, there would be no communication possible
 * with the project.
 */
self.addEventListener('message', (e) => {
    if (e.data.msg !== 'load' && !cvReady) {
        // postmessage that opencv is still loading or have some kind of queue
        return
    }
    switch (e.data.msg) {
        case 'load': {
            if (cvReady) {
                postMessage({msg: e.data.msg})
                return;
            }
            // Import Webassembly script
            console.log("Loading OpenCV from SW")
            // eslint-disable-next-line no-restricted-globals
            importScripts('./custom_opencv_2.js')
            importScripts('./utils.js')
            cv.onRuntimeInitialized = () => {
                console.debug("#opencv loaded !");
                cvReady = true;
                postMessage({msg: e.data.msg})
            };
            break
        }
        case 'imageProcessing': {
            return imageProcessing(e.data.msg, e.data.data)
        }
        case 'sudokuProcessing': {
            return sudokuProcessing(e.data.msg, e.data.data)
        }
        default:
            break
    }
})
