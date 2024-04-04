import React, { useContext, useEffect, useRef } from "react";

import { SudokuContext } from "../../contexts/sudoku-context";
import useImageInferrer from "../../lib/hooks/useImageInferrer";

const height = 800;
const width = 800;

const Picture = () => {
  const sudokuContext = useContext(SudokuContext);

  const imgRef = useRef<HTMLImageElement>(null);

  const [processing, inferrence] = useImageInferrer(imgRef);

  useEffect(() => {

    // maybe check if configured global sudoku is same as inferred one
    // or only set sudoku after manual button click
    if (inferrence) {
      sudokuContext.setSudoku(inferrence);
    }
  }, [inferrence, sudokuContext.setSudoku]);

  return (
    <>
      <img
        style={{ display: "none" }}
        alt={"Test"}
        width={width}
        height={height}
        src={"/img/sudoku-original.jpg"}
        ref={imgRef}
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
        </div>

        <img
          style={{ maxWidth: "100%" }}
          alt={"Test"}
          src={"/img/sudoku-original.jpg"}
        />
      </div>
    </>
  );
};
export default Picture;
