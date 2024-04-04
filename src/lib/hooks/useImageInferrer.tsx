import React, { useEffect, useState } from "react";
import cv from "../services/cv";
import { SudokuListType, fromPredictions } from "../utils/sudoku";

function useImageInferrer(imageRef: React.RefObject<HTMLImageElement>) {
  const height = 800;
  const width = 800;

  const [processing, setProcessing] = useState<boolean>(false);
  const [inference, setInference] = useState<SudokuListType>();

  useEffect(() => {
    setProcessing(true);

    const canvasElement = document.createElement("canvas", {});
    canvasElement.width = width;
    canvasElement.height = height;
    canvasElement.hidden = true;

    console.log("test");
    cv.load().then(() => {
      const ctx = canvasElement.getContext("2d");

      console.log("hello");

      if (ctx !== null && ctx !== undefined && imageRef.current !== null) {
        console.log("hi");
        // draw loaded image onto canvas
        ctx.drawImage(imageRef.current, 0, 0, width, height);

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
  }, [imageRef]);

  return [processing, inference] as const;
}

export default useImageInferrer;
