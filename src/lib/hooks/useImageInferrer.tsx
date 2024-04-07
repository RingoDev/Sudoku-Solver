import { useEffect, useState } from "react";
import cv from "../../worker/queue";
import { SudokuListType, fromPredictions } from "../utils/sudoku";

function useImageInferrer(imageUrl?: string, shouldTrigger?: boolean) {
  const height = 800;
  const width = 800;

  const [processing, setProcessing] = useState<boolean>(false);
  const [inference, setInference] = useState<SudokuListType>();

  useEffect(() => {
    console.log(imageUrl);
    if (imageUrl === undefined || !shouldTrigger) return;
    setProcessing(true);

    const imageElement = document.createElement("img");
    imageElement.width = width;
    imageElement.height = height;
    imageElement.src = imageUrl;

    const canvasElement = document.createElement("canvas");
    canvasElement.width = width;
    canvasElement.height = height;

    console.log("test");
    cv.load().then(() => {
      const ctx = canvasElement.getContext("2d");

      console.log("hello");

      if (ctx !== null && ctx !== undefined) {
        console.log("hi");
        // draw loaded image onto canvas
        ctx.drawImage(imageElement, 0, 0, width, height);

        // retrieve binary image data from canvas
        const image = ctx.getImageData(0, 0, width, height);

        // Processing image
        cv.sudokuProcessing(image).then((data) => {
          setProcessing(false);
          setInference(fromPredictions(data.data.predictions));
        });
      }
    });
    return () => canvasElement.remove();
  }, [imageUrl, shouldTrigger]);

  return [processing, inference] as const;
}

export default useImageInferrer;
