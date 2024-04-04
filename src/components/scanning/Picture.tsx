import React, { useContext, useRef, useState } from "react";
import cv from "../../lib/services/cv";
import {
  digit,
  fromPredictions,
  getEmpty,
  SudokuGridType,
} from "../../lib/utils/sudoku";
import { SudokuContext } from "../../contexts/sudoku-context";
import Link from "next/link";

const height = 800;
const width = 800;

interface PictureProps {
  // solveSudoku: (val: SudokuGridType) => void;
}

const Picture: React.FC<PictureProps> = (props) => {
  const sudokuContext = useContext(SudokuContext);

  const [processing, updateProcessing] = useState(false);

  // Canvas for converting input image to ImageData
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas for drawing result
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  // const [outputURL, setOutputURL] = useState<string>();
  const imgElement = useRef<HTMLImageElement>(null);
  const [predictions, setPredictions] = useState<SudokuGridType>(getEmpty());

  // const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedNum, setSelectedNum] = useState<[number, number]>([-1, -1]);

  // const toggle = () => setIsOpen(!isOpen);

  async function onClick() {
    updateProcessing(true);

    const canvasEl = canvasRef.current;
    const displayCanvas = displayCanvasRef.current;
    if (canvasEl !== null && displayCanvas !== null) {
      const ctx = canvasEl.getContext("2d");
      const ctx2 = displayCanvas.getContext("2d");
      if (ctx !== null && imgElement.current !== null && ctx2 !== null) {
        ctx.drawImage(imgElement.current, 0, 0, width, height);
        const image = ctx.getImageData(0, 0, width, height);
        // Load the model
        await cv.load();
        // Processing image

        const result = (await cv.sudokuProcessing(image)) as {
          data: { payload: ImageData; predictions: digit[][] };
        };

        ctx2.canvas.height = result.data.payload.height;
        ctx2.canvas.width = result.data.payload.width;
        // Render the processed image to the canvas
        ctx2.putImageData(result.data.payload, 0, 0);
        // setOutputURL(ctx2.canvas.toDataURL());
        updateProcessing(false);
        setPredictions(result.data.predictions);
        sudokuContext.setSudoku(fromPredictions(result.data.predictions));
      }
    }
  }

  const changeNumber = (n: digit) => {
    if (selectedNum) {
      //change selected Num in Sudoku to number
      const newPred = predictions.slice();
      newPred[selectedNum[0]][selectedNum[1]] = n;
      setPredictions(newPred);
      console.debug("changednumber", selectedNum, n);
    }
  };

  return (
    <>
      <img
        style={{ display: "none" }}
        alt={"Test"}
        width={width}
        height={height}
        src={"/img/sudoku-original.jpg"}
        ref={imgElement}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <button
            color={"info"}
            disabled={processing}
            style={{ margin: "1rem" }}
            onClick={onClick}
          >
            {processing ? "Processing..." : "Convert"}
          </button>
        </div>

        <img
          style={{ maxWidth: "100%" }}
          alt={"Test"}
          src={"/img/sudoku-original.jpg"}
        />

        {/*<video className="video" playsInline ref={videoElement}/>*/}

        <canvas
          style={{ display: "none" }}
          ref={canvasRef}
          width={width}
          height={height}
        />
        <canvas
          style={{ display: "none" }}
          ref={displayCanvasRef}
          width={width}
          height={height}
        />
      </div>
    </>
  );
};
export default Picture;
