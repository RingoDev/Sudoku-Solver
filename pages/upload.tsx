import React, { useContext, useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";
import { SudokuContext } from "../src/contexts/sudoku-context";

const height = 800;
const width = 800;

const Upload = () => {
  const sudokuContext = useContext(SudokuContext);

  const [imgUrl, setImgUrl] = useState<string>()

  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <input accept="image/*" type="file" onChange={(ev) => {
        if(ev.target.files !== null){
           const file = ev.target.files[0]
           if(file){
            setImgUrl(URL.createObjectURL(file))
           }
        }
      }}/>
      <button onClick={() => setImgUrl("/img/sudoku-original.jpg")}>
        Use default
        </button>
      {imgUrl ? <img src={imgUrl} height={800} width={800}/> : <></>}
    </>
  );
};
export default Upload;
