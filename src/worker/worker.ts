import { MessageType } from "./queue";
import {
  combineDigits,
  extractDigit,
  getSquares,
  imageDataFromMat,
  preProcessing,
} from "./utils";
import * as tf from "@tensorflow/tfjs";

import type * as cvTypes from "mirada/dist/src/types/opencv/_types";
import type { Mat } from "mirada/dist/src/types/opencv/_types";
export type OpenCV = typeof cvTypes;

let cvReady = false;
let tfModel: tf.LayersModel | undefined;
let loading = false;

let cv: OpenCV;

function sendMessage(msg: MessageType, payload: { [key: string]: any }) {
  console.log(payload);
  return postMessage({ msg, ...payload });
}

/**
 * With OpenCV we have to work with the images as cv.Mat (matrices),
 * so you'll have to transform the ImageData to it.
 */
function imageProcessing(msg: MessageType, payload: ImageData) {
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();

  // This converts the image to a greyscale.
  cv.cvtColor(img, result, cv.COLOR_BGR2GRAY);

  sendMessage(msg, { payload: imageDataFromMat(cv, result) });
}

export async function getPredictions(digits: Mat[], tfModel: tf.LayersModel) {
  const numbers = [];

  for (let i = 0; i < 9; i++) {
    const sudokuCol = [];
    for (let j = 0; j < 9; j++) {
      const input = [];
      const digit = digits[i + j * 9];
      let isBlack = true;
      for (let value of digit.data) {
        if (isBlack && value !== 0) isBlack = false;
        input.push(value / 255);
      }
      if (!isBlack) {
        let predictedTensor = tfModel.predict([
          tf.tensor(input).reshape([1, 28, 28, 1]),
        ]);

        if (Array.isArray(predictedTensor)) {
          throw "Got unexpected array of tensors";
        }

        const scores = (await predictedTensor.array()) as number[][];
        const predicted = scores[0].indexOf(Math.max(...scores[0]));

        sudokuCol.push(predicted);
        // will never recognize a european 1 due to MNIST Dataset
        // if(predicted === 7) console.debug(scores[0])
      } else {
        sudokuCol.push(0);
      }
    }
    numbers.push(sudokuCol);
  }
  return numbers;
}

async function sudokuProcessing(msg: MessageType, payload: ImageData) {
  let resolveTF;
  if (tfModel === undefined) {
    resolveTF = tf.loadLayersModel("http://localhost:3000/js/model/model.json");
  }

  const undistorted = preProcessing(cv, payload);

  // try to fetch out single digits
  const squares = getSquares(undistorted.rows);

  const digits: Mat[] = [];
  for (let square of squares) {
    digits.push(extractDigit(cv, undistorted, square));
  }

  if (tfModel === undefined) {
    tfModel = await resolveTF;
  }

  if (!tfModel) return;

  const numbers = await getPredictions(digits, tfModel);

  const result = combineDigits(cv, digits);

  sendMessage(msg, {
    payload: imageDataFromMat(cv, result),
    predictions: numbers,
  });

  // clear up our garbage
  undistorted.delete();
  result.delete();
}

/**
 * This exists to capture all the events that are thrown out of the worker
 * into the worker. Without this, there would be no communication possible
 * with the project.
 */
self.addEventListener("message", async (e) => {
  console.log("Received message in worker: ", e);
  if (e.data.msg !== "load" && !cvReady) {
    postMessage({ msg: e.data.msg, error: true });
    return;
  }

  switch (e.data.msg) {
    case "load": {
      if (cvReady) {
        postMessage({ msg: "load" });
        return;
      }
      if (loading) return;
      loading = true;
      // Import Webassembly script
      console.log("Loading OpenCV from SW");
      // eslint-disable-next-line no-restricted-globals
      cv = await (await import("../opencv/opencv_js")).default();
      cvReady = true;
      console.log("loaded opencv");
      postMessage({ msg: "load" });

      break;
    }
    case "imageProcessing": {
      return imageProcessing(e.data.msg, e.data.data);
    }
    case "sudokuProcessing": {
      return sudokuProcessing(e.data.msg, e.data.data);
    }
    default:
      break;
  }
});
