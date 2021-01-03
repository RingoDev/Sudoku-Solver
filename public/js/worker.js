/**
 *  Here we will check from time to time if we can access the OpenCV
 *  functions. We will return in a callback if it's been resolved
 *  well (true) or if there has been a timeout (false).
 */


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
    const image = {
        height: payload.height,
        width: payload.width
    }

    const img = cv.matFromImageData(payload)
    const sudoku = new cv.Mat()


    // This converts the image to a greyscale.
    cv.cvtColor(img, sudoku, cv.COLOR_BGR2GRAY)
    console.log(sudoku.size())
    //Next, we create a blank image of the same size. This image will hold the actual outer box of puzzle:
    const outerBox = new cv.Mat(sudoku.size(), cv.CV_8UC1)

    //Blur the image a little. This smooths out the noise a bit and makes extracting the grid lines easier.
    // const kSize = new cv.Size(11, 11)
    // cv.GaussianBlur(sudoku, sudoku, kSize, 0)

    // With the noise smoothed out, we can now threshold the image.
    // The image can have varying illumination levels, so a good choice for a thresholding
    // algorithm would be an adaptive threshold. It calculates a threshold level several small
    // windows in the image. This threshold level is calculated using the mean level in the window.
    // So it keeps things illumination independent.

    cv.adaptiveThreshold(sudoku, outerBox, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 5, 2)

    //It calculates a mean over a 5x5 window and subtracts 2 from the mean. This is the threshold level for every pixel.
    //
    // Since we're interested in the borders, and they are black, we invert the image outerBox. Then, the borders of the puzzles are white (along with other noise).
    //
    cv.bitwise_not(outerBox, outerBox);

    // This thresholding operation can disconnect certain connected parts (like lines). So dilating the image once will fill up any small "cracks" that might have crept in.
    // should use a plus sign not only ones but leave it for now
    const kernel = cv.matFromArray(3, 3, cv.CV_8UC1, [0, 1, 0, 1, 1, 1, 0, 1, 0]);
    cv.dilate(outerBox, outerBox, kernel);

    const labels = new cv.Mat()
    const stats = new cv.Mat();
    const centoids = new cv.Mat();
    // todo figure out why result is different on first calculation than subsequent calcuations
    cv.connectedComponentsWithStats(outerBox, labels, stats, centoids, 8, cv.CV_32S)
    console.debug(stats)


    // trying to grab the blob with the largest area excluding the background

    let maxArea = -1;
    const boxStats = {
        label: -1,
        left_x: -1,
        top_y: -1,
        width: -1,
        height: -1,
    }

    for (let i = 0; i * 5 < stats.data32S.length; i++) {
        const leftmost_x = stats.data32S[i * 5 + cv.CC_STAT_LEFT]
        const topmost_y = stats.data32S[i * 5 + cv.CC_STAT_TOP]
        const width = stats.data32S[i * 5 + cv.CC_STAT_WIDTH]
        const height = stats.data32S[i * 5 + cv.CC_STAT_HEIGHT]
        // i want a different area
        // const area = stats.data32S[i * 5 + cv.CC_STAT_AREA]
        const area = width * height;

        if (width !== payload.width && height !== payload.height && area > maxArea) {
            maxArea = area;
            boxStats.label = i;
            boxStats.left_x = leftmost_x;
            boxStats.top_y = topmost_y;
            boxStats.width = width;
            boxStats.height = height;
        }

        // console.debug('area of label ' + i + ' is: ' + area);
        // console.debug(width * height)
        // console.debug('Max area is ' + maxArea + ' of label ' + boxStats.label);
    }

    for (let i = 0; i < labels.data32S.length; i++) {
        if (labels.data32S[i] === boxStats.label) {
            //    color this field white in outerBox
            outerBox.data[i] = 255;
        } else {
            // color field black in outerBox
            outerBox.data[i] = 0;
        }
    }

    //Because we had dilated the image earlier, we'll "restore" it a bit by eroding it:
    cv.erode(outerBox, outerBox, kernel)


    //At this point, we have a single blob. Now its time to find lines. This is done with the Hough transform.
    // OpenCV comes with it. So a line of code is all that's needed:
    let lines = new cv.Mat()
    // cv.HoughLines(outerBox, lines, 1, cv.CV_PI / 180, 200);
    // console.debug(lines)


    // image	8-bit, single-channel binary source image. The image may be modified by the function.
    // lines	Output vector of lines. Each line is represented by a 4-element vector (x1,y1,x2,y2) ,
    // where (x1,y1) and (x2,y2) are the ending points of each detected line segment.

    // Distance resolution of the accumulator in pixels.
    const rho = 1
    //Angle resolution of the accumulator in radians.
    const theta = Math.PI / 180;
    // Accumulator threshold parameter. Only those lines are returned that get enough votes ( >𝚝𝚑𝚛𝚎𝚜𝚑𝚘𝚕𝚍 ).
    const threshold = 2;

    //values can be adapted
    //Minimum line length. Line segments shorter than that are rejected.
    const minLineLength = image.height * 0.2
    // Maximum allowed gap between points on the same line to link them.
    const maxLineGap = image.height * 0.05;

    cv.HoughLinesP(outerBox, lines, rho, theta, threshold, minLineLength, maxLineGap);

    console.debug(lines)

    const lineMat = new cv.Mat()

    // let lineArray = []
    let pointArray = []

    let color = new cv.Scalar(255, 0, 0);

    const output = cv.Mat.zeros(sudoku.rows, sudoku.cols, cv.CV_8UC3);

    for (let i = 0; i < lines.rows; ++i) {
        let startPoint = new cv.Point(lines.data32S[i * 4], lines.data32S[i * 4 + 1]);
        let endPoint = new cv.Point(lines.data32S[i * 4 + 2], lines.data32S[i * 4 + 3]);
        // lineArray.push({
        //     start: {x: lines.data32S[i * 4], y: lines.data32S[i * 4 + 1]},
        //     end: {x: lines.data32S[i * 4 + 2], y: lines.data32S[i * 4 + 3]}
        // })
        pointArray.push({x: lines.data32S[i * 4], y: lines.data32S[i * 4 + 1]})
        pointArray.push({x: lines.data32S[i * 4 + 2], y: lines.data32S[i * 4 + 3]})
        cv.line(output, startPoint, endPoint, color);
    }


    let topLeftCorner = {x: 0, y: 0}
    let topRightCorner = {x: image.width, y: 0}
    let bottomLeftCorner = {x: 0, y: image.height}
    let bottomRightCorner = {x: image.width, y: image.height}
    // we found lines in the image, now find the corner points
    let topLeft = {x: image.width / 2, y: image.height / 2}
    let topRight = {x: image.width / 2, y: image.height / 2}
    let bottomLeft = {x: image.width / 2, y: image.height / 2}
    let bottomRight = {x: image.width / 2, y: image.height / 2}

    // todo save minimal distance for optimization
    for (let point of pointArray) {
        if (distanceBetween(point, topLeftCorner) < distanceBetween(topLeft, topLeftCorner)) {
            topLeft = point
        }
        if (distanceBetween(point, topRightCorner) < distanceBetween(topRight, topRightCorner)) {
            topRight = point
        }
        if (distanceBetween(point, bottomLeftCorner) < distanceBetween(bottomLeft, bottomLeftCorner)) {
            bottomLeft = point
        }
        if (distanceBetween(point, bottomRightCorner) < distanceBetween(bottomRight, bottomRightCorner)) {
            bottomRight = point
        }
    }

    let maxLength = -1;
    let dist = distanceBetween(topLeft, topRight)
    if (dist > maxLength) maxLength = dist;
    dist = distanceBetween(topRight, bottomRight)
    if (dist > maxLength) maxLength = dist;
    dist = distanceBetween(bottomRight, bottomLeft)
    if (dist > maxLength) maxLength = dist;
    dist = distanceBetween(bottomLeft, topLeft)
    if (dist > maxLength) maxLength = dist;

    // console.debug(maxLength)


    const src = cv.matFromArray(4, 1,cv.CV_32FC2, [
        topLeft.x, topLeft.y, topRight.x, topRight.y,
        bottomRight.x, bottomRight.y, bottomLeft.x, bottomLeft.y
    ]);
    const dst = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0, maxLength - 1, 0,
        maxLength - 1, maxLength - 1, 0, maxLength - 1]);
    // src[0] = new cv.Point(topLeft.x, topLeft.y);
    // src[1] = new cv.Point(topRight.x, topRight.y);
    // src[2] = new cv.Point(bottomRight.x, bottomRight.y);
    // src[3] = new cv.Point(bottomLeft.x, bottomLeft.y);
    // dst[0] = new cv.Point(0, 0);
    // dst[1] = new cv.Point(maxLength - 1, 0);
    // dst[2] = new cv.Point(maxLength - 1, maxLength - 1);
    // dst[3] = new cv.Point(0, maxLength - 1);

    //size of the processed Sudoku
    const newSize = new cv.Size(maxLength, maxLength)
    //Mat of the result
    const undistorted = new cv.Mat(newSize, cv.CV_8UC3);
    //transformation Matrix
    let M = cv.getPerspectiveTransform(src, dst);

    cv.warpPerspective(sudoku, undistorted, M, newSize);




    postMessage({msg, payload: imageDataFromMat(undistorted)})

    // outerBox.delete();
    // sudoku.delete();
    // kernel.delete();
    // lines.delete();
    // centoids.delete();
    // stats.delete();
    // labels.delete();
    // undistorted.delete();
}

/**
 *
 * @param {{x:number,y:number}} point1
 * @param {{x:number,y:number}} point2
 *
 * @returns {number} the Distance
 */
function distanceBetween(point1, point2) {
    return Math.sqrt(((point1.x - point2.x) ** 2) + ((point1.y - point2.y) ** 2))
}

/**
 * This function converts again from cv.Mat to ImageData
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
