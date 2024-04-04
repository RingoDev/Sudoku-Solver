/*eslint-disable*/

/**
 *
 * @param corners {[{x:number,y:number},{x:number,y:number},{x:number,y:number},{x:number,y:number}]}
 * @param maxLength length of the longest edge
 * @return {cv.Mat}
 */
function getTransformationMatrix(corners, maxLength) {
  const src = cv.matFromArray(4, 1, cv.CV_32FC2, [
    corners[0].x,
    corners[0].y,
    corners[1].x,
    corners[1].y,
    corners[3].x,
    corners[3].y,
    corners[2].x,
    corners[2].y,
  ]);
  const dst = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    maxLength - 1,
    0,
    0,
    maxLength - 1,
    maxLength - 1,
    maxLength - 1,
  ]);

  //transformation Matrix
  return cv.getPerspectiveTransform(src, dst);
}

/**
 * @param pointArray {[{x:number,y:number}]}
 * @param originalWidth {number}
 * @param originalHeight {number}
 *
 * @returns {[{x:number,y:number},{x:number,y:number},{x:number,y:number},{x:number,y:number}]} in format [top_left,top_right,bot_right,bot_left]
 */
function getCornerPoints(pointArray, originalWidth, originalHeight) {
  const CONSTANT_CORNERS = [
    { x: 0, y: 0 },
    { x: originalWidth, y: 0 },
    { x: originalWidth, y: originalHeight },
    {
      x: 0,
      y: originalHeight,
    },
  ];
  const minDist = [Infinity, Infinity, Infinity, Infinity];
  const corners = [
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: -1 },
  ];

  // todo save minimal distance for optimization
  for (let point of pointArray) {
    for (let i = 0; i < CONSTANT_CORNERS.length; i++) {
      const dist = distanceBetween(point, CONSTANT_CORNERS[i]);
      if (dist < minDist[i]) {
        minDist[i] = dist;
        corners[i] = point;
      }
    }
  }
  return corners;
}

/**
 * Calculates the longest edge of the sudoku
 *
 * @param corners {[{x:number,y:number},{x:number,y:number},{x:number,y:number},{x:number,y:number}]}
 * @return {number}
 */
function getMaxLength(corners) {
  let maxLength = -1;
  for (let i = 0; i < 4; i++) {
    const dist = distanceBetween(corners[i], corners[(i + 1) % 4]);
    if (dist > maxLength) maxLength = dist;
  }
  return maxLength;
}

/**
 * Finds the largest connected Object on the Mat and removes all other objects
 *
 * @param mat the Mat to operate upon (will be changed)
 * @param originalWidth {number}
 * @param originalHeight {number}
 */
function findLargestBlob(mat, originalWidth, originalHeight) {
  const labels = new cv.Mat();
  const stats = new cv.Mat();
  const centoids = new cv.Mat();

  cv.connectedComponentsWithStats(mat, labels, stats, centoids, 8, cv.CV_32S);

  // trying to grab the blob with the largest area excluding the background
  let maxArea = -1;
  const boxStats = {
    label: -1,
    left_x: -1,
    top_y: -1,
    width: -1,
    height: -1,
  };

  const statsList = stats.data32S;
  for (let i = 0; i * 5 < statsList.length; i++) {
    const leftmost_x = statsList[i * 5 + cv.CC_STAT_LEFT];
    const topmost_y = statsList[i * 5 + cv.CC_STAT_TOP];
    const width = statsList[i * 5 + cv.CC_STAT_WIDTH];
    const height = statsList[i * 5 + cv.CC_STAT_HEIGHT];
    // i want a different area
    // const area = stats.data32S[i * 5 + cv.CC_STAT_AREA]
    const area = width * height;

    if (
      width !== originalWidth &&
      height !== originalHeight &&
      area > maxArea
    ) {
      maxArea = area;
      boxStats.label = i;
      boxStats.left_x = leftmost_x;
      boxStats.top_y = topmost_y;
      boxStats.width = width;
      boxStats.height = height;
    }
  }

  for (let i = 0; i < labels.data32S.length; i++) {
    if (labels.data32S[i] === boxStats.label) {
      //    color this field white in outerBox
      mat.data[i] = 255;
    } else {
      // color field black in outerBox
      mat.data[i] = 0;
    }
  }

  centoids.delete();
  stats.delete();
  labels.delete();
}

/**
 *
 * @param outerBox the Mat to operate upon (will not be changed)
 * @param originalWidth
 * @param originalHeight
 * @returns {cv.Mat}
 */
function findLines(outerBox, originalWidth, originalHeight) {
  //At this point, we have a single blob. Now its time to find lines. This is done with the Hough transform.
  let lines = new cv.Mat();

  // image	8-bit, single-channel binary source image. The image may be modified by the function.
  // lines	Output vector of lines. Each line is represented by a 4-element vector (x1,y1,x2,y2) ,
  // where (x1,y1) and (x2,y2) are the ending points of each detected line segment.

  // Distance resolution of the accumulator in pixels.
  const rho = 1;
  //Angle resolution of the accumulator in radians.
  const theta = Math.PI / 180;
  // Accumulator threshold parameter. Only those lines are returned that get enough votes ( >𝚝𝚑𝚛𝚎𝚜𝚑𝚘𝚕𝚍 ).
  const threshold = 2;

  //values can be adapted
  //Minimum line length. Line segments shorter than that are rejected.
  const minLineLength = originalHeight * 0.2;
  // Maximum allowed gap between points on the same line to link them.
  const maxLineGap = originalHeight * 0.05;

  cv.HoughLinesP(
    outerBox,
    lines,
    rho,
    theta,
    threshold,
    minLineLength,
    maxLineGap
  );
  return lines;
}

/**
 *
 * @param maxLength the complete edge Length
 * @return {{p1:{x1:number,x2:number},p2:{x1:number,x2:number}}[]}
 */
function getSquares(maxLength) {
  const squares = [];
  const side = Math.floor(maxLength / 9);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      squares.push({
        //Top left corner of a bounding box
        p1: { x: i * side, y: j * side },
        //Bottom right corner of bounding box
        p2: { x: (i + 1) * side, y: (j + 1) * side },
      });
    }
  }
  return squares;
}

function getOuterbox(img, sudoku, payload) {
  // This converts the image to a greyscale.
  cv.cvtColor(img, sudoku, cv.COLOR_BGR2GRAY);

  //Next, we create a blank image of the same size. This image will hold the actual outer box of puzzle:
  const outerBox = new cv.Mat(sudoku.size(), cv.CV_8UC1);
  //Blur the image a little. This smooths out the noise a bit and makes extracting the grid lines easier.
  const kSize = new cv.Size(11, 11);
  cv.GaussianBlur(sudoku, sudoku, kSize, 0);

  cv.adaptiveThreshold(
    sudoku,
    outerBox,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY,
    5,
    2
  );

  // Since we're interested in the borders, and they are black, we invert the image outerBox.
  // Then, the borders of the puzzles are white (along with other noise).
  cv.bitwise_not(outerBox, outerBox);

  const kernel = cv.matFromArray(3, 3, cv.CV_8UC1, [0, 1, 0, 1, 1, 1, 0, 1, 0]);

  // This thresholding operation can disconnect certain connected parts (like lines).
  // So dilating the image once will fill up any small "cracks" that might have crept in.
  cv.dilate(outerBox, outerBox, kernel);
  findLargestBlob(outerBox, payload.width, payload.height);
  //Because we had dilated the image earlier, we'll "restore" it a bit by eroding it:
  cv.erode(outerBox, outerBox, kernel);

  kernel.delete();
  return outerBox;
}

/**
 * @param digits {cv.Mat[]}
 * @return {cv.Mat}
 */
function combineDigits(digits) {
  // put together the digits for display
  const result = new cv.Mat(new cv.Size(28 * 9, 28 * 9), cv.CV_8UC1);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      digits[i * 9 + j].copyTo(
        result.roi(
          new cv.Rect(
            i * 28,
            j * 28,
            digits[i * 9 + j].cols,
            digits[i * 9 + j].rows
          )
        )
      );
      digits[i * 9 + j].delete();
    }
  }
  return result;
}

/**
 * @param payload {ImageData}
 * @return {cv.Mat}
 */
function preProcessing(payload) {
  const img = cv.matFromImageData(payload);
  const sudoku = new cv.Mat();
  const outerBox = getOuterbox(img, sudoku, payload);
  const lines = findLines(outerBox, payload.width, payload.height);
  const lineMat = cv.Mat.zeros(sudoku.rows, sudoku.cols, cv.CV_8UC3);
  const pointArray = drawLines(lines, lineMat);
  const corners = getCornerPoints(pointArray, payload.width, payload.height);
  const maxLength = getMaxLength(corners);
  const M = getTransformationMatrix(corners, maxLength);

  //size of the processed Picture
  const newSize = new cv.Size(maxLength, maxLength);
  //Mat of the result
  const undistorted = new cv.Mat(newSize, cv.CV_8UC3);

  cv.warpPerspective(sudoku, undistorted, M, newSize);

  // thresholding and inverting
  cv.adaptiveThreshold(
    undistorted,
    undistorted,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY,
    5,
    2
  );

  // Since we're interested in the borders, and they are black, we invert the image outerBox.
  // Then, the borders of the puzzles are white (along with other noise).
  cv.bitwise_not(undistorted, undistorted);

  img.delete();
  lines.delete();
  lineMat.delete();
  M.delete();
  sudoku.delete();
  return undistorted;
}

/**
 * Extracts a digit in white (if one exists) from a Picture square.
 *
 * @param undistorted {cv.Mat}
 * @param square {{p1:{x,y},p2:{x,y}}}
 * @return {cv.Mat}
 */
function extractDigit(undistorted, square) {
  const digit = undistorted.roi(
    new cv.Rect(
      square.p1.x,
      square.p1.y,
      square.p2.x - square.p1.x,
      square.p2.y - square.p1.y
    )
  );

  // postMessage({msg, payload: imageDataFromMat(digit)})

  const labels = new cv.Mat();
  const stats = new cv.Mat();
  const centoids = new cv.Mat();

  cv.connectedComponentsWithStats(digit, labels, stats, centoids, 8, cv.CV_32S);

  // scan which labels are inside our margin

  const w = digit.cols;
  const h = digit.rows;
  const margin = Math.floor((w + h) / 2 / 2.5);

  const foundLabels = new Set();
  for (let i = margin; i < w - margin; i++) {
    for (let j = margin; j < h - margin; j++) {
      foundLabels.add(labels.intAt(i, j));
    }
  }

  // try to grab the largest blob in the center
  // trying to grab the blob with the largest area excluding the background
  let maxArea = -1;
  const boxStats = {
    label: -1,
    left_x: -1,
    top_y: -1,
    width: -1,
    height: -1,
  };

  const statsList = stats.data32S;
  for (let i = 0; i * 5 < statsList.length; i++) {
    const leftmost_x = statsList[i * 5 + cv.CC_STAT_LEFT];
    const topmost_y = statsList[i * 5 + cv.CC_STAT_TOP];
    const width = statsList[i * 5 + cv.CC_STAT_WIDTH];
    const height = statsList[i * 5 + cv.CC_STAT_HEIGHT];
    const area = stats.data32S[i * 5 + cv.CC_STAT_AREA];

    if (i !== 0 && area > maxArea && foundLabels.has(i)) {
      maxArea = area;
      boxStats.label = i;
      boxStats.left_x = leftmost_x;
      boxStats.top_y = topmost_y;
      boxStats.width = width;
      boxStats.height = height;
    }
  }

  for (let i = 0; i < labels.data32S.length; i++) {
    if (labels.data32S[i] === boxStats.label) {
      //    color this field white in outerBox
      digit.data[i] = 255;
    } else {
      // color field black in outerBox
      digit.data[i] = 0;
    }
  }

  centoids.delete();
  stats.delete();
  labels.delete();

  let boundingBox;
  // if maxArea is -1 , we didnt find a number in this box
  if (maxArea === -1) {
    boundingBox = new cv.Mat.zeros(10, 10, cv.CV_8UC1);
  } else {
    boundingBox = digit.roi(
      new cv.Rect(
        boxStats.left_x,
        boxStats.top_y,
        boxStats.width,
        boxStats.height
      )
    );
    // pad the image to a square so it doesnt get distorted on resize
    pad_to_square(boundingBox);
  }
  digit.delete();

  const final_padding = boundingBox.cols / 10;
  // pad image with some percent to increase similarity to MNIST Dataset
  cv.copyMakeBorder(
    boundingBox,
    boundingBox,
    final_padding,
    final_padding,
    final_padding,
    final_padding,
    cv.BORDER_CONSTANT,
    new cv.Scalar(0)
  );

  // scale image to further processing size 28x28
  cv.resize(
    boundingBox,
    boundingBox,
    new cv.Size(28, 28),
    0,
    0,
    cv.INTER_LINEAR
  );

  return boundingBox;
}

/**
 *
 * @param img {cv.Mat} the img that should become a square
 */
function pad_to_square(img) {
  // Scales and centres an image onto a new background square."""
  let h = img.rows;
  let w = img.cols;
  let t_pad = 0,
    b_pad = 0,
    l_pad = 0,
    r_pad = 0;

  if (h > w) {
    const diff = h - w;
    l_pad = Math.floor(diff / 2);
    r_pad = l_pad;
  } else {
    const diff = w - h;
    t_pad = Math.floor(diff / 2);
    b_pad = t_pad;
  }

  // resizing to 1 Pixel difference is good enough , rest can be distorted on resize later
  cv.copyMakeBorder(
    img,
    img,
    t_pad,
    b_pad,
    l_pad,
    r_pad,
    cv.BORDER_CONSTANT,
    new cv.Scalar(0)
  );
  console.assert(
    Math.abs(img.rows - img.cols) <= 1,
    "Digit is not square enough"
  );
}

//todo remove the drawing part
/**
 * Draws Lines on a Mat and saves all the found Points in an Array
 *
 * @param lines
 * @param output the Mat to draw the lines on
 * @return {[{x:number,y:number}]}
 */
function drawLines(lines, output) {
  const pointArray = [];
  let color = new cv.Scalar(255, 0, 0);

  for (let i = 0; i < lines.rows; ++i) {
    let startPoint = new cv.Point(
      lines.data32S[i * 4],
      lines.data32S[i * 4 + 1]
    );
    let endPoint = new cv.Point(
      lines.data32S[i * 4 + 2],
      lines.data32S[i * 4 + 3]
    );
    pointArray.push({ x: lines.data32S[i * 4], y: lines.data32S[i * 4 + 1] });
    pointArray.push({
      x: lines.data32S[i * 4 + 2],
      y: lines.data32S[i * 4 + 3],
    });
    cv.line(output, startPoint, endPoint, color);
  }
  return pointArray;
}

/**
 *
 * @param {{x:number,y:number}} point1
 * @param {{x:number,y:number}} point2
 *
 * @returns {number} the Distance
 */
function distanceBetween(point1, point2) {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}
