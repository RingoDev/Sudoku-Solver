import React, { useContext, useEffect } from "react";

import { SudokuContext } from "../../contexts/sudoku-context";
import useImageInferrer from "../../lib/hooks/useImageInferrer";
import { ImageContext } from "../../contexts/uploaded-image-context";
import ParsedSudoku from "./parsed-sudoku";

const Picture = () => {
  const sudokuContext = useContext(SudokuContext);
  const { imageUrl } = useContext(ImageContext);

  const [processing, inferrence] = useImageInferrer(
    imageUrl,
    sudokuContext.sudoku === undefined,
  );

  const sudokuToDisplay = sudokuContext.sudoku
    ? sudokuContext.sudoku
    : inferrence;

  useEffect(() => {
    // maybe check if configured global sudoku is same as inferred one
    // or only set sudoku after manual button click
    if (inferrence) {
      sudokuContext.setSudoku(inferrence);
    }
  }, [inferrence, sudokuContext.setSudoku, sudokuContext]);

  return (
    <>
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
        ></div>
        <img
          className={"max-h-60 object-contain"}
          alt={"No Image uploaded yet"}
          src={imageUrl}
        />

        {processing ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-loader-circle"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="1s"
                additive="sum"
                repeatCount="indefinite"
              />
            </svg>
          </>
        ) : null}
      </div>
      {sudokuToDisplay ? (
        <ParsedSudoku sudoku={sudokuToDisplay}></ParsedSudoku>
      ) : null}
    </>
  );
};
export default Picture;
