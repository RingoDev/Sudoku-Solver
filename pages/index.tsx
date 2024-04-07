import React, { useContext, useRef, useState } from "react";

import { ImageContext } from "../src/contexts/uploaded-image-context";
import { useRouter } from "next/router";

const height = 800;
const width = 800;

const Upload = () => {
  const router = useRouter();

  const imageContext = useContext(ImageContext);

  const [imgUrl, setImgUrl] = useState<string | undefined>(
    imageContext.imageUrl,
  );

  const imgRef = useRef<HTMLImageElement>(null);

  const uploadFile = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.capture = "environment";
    inputElement.onchange = () => {
      if (inputElement.files !== null) {
        const file = inputElement.files[0];
        if (file) {
          setImgUrl(URL.createObjectURL(file));
        }
      }
    };
    inputElement.click();
    inputElement.remove();
  };

  const setImageAndNavigate = () => {
    imageContext.setImageUrl(imgUrl || "");
    router.push("/scan");
  };

  return (
    <div className={"p-4"}>
      <div className={"flex justify-center mb-2 "}>
        <button
          className={
            "bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded p-2"
          }
          onClick={() => uploadFile()}
        >
          {" "}
          Upload
        </button>
        <button
          className={"p-2"}
          onClick={() => setImgUrl("/img/sudoku-original.jpg")}
        >
          Use default
        </button>
      </div>

      {imgUrl ? (
        <>
          <img
            className={"max-h-60 object-contain"}
            ref={imgRef}
            src={imgUrl}
            height={height}
            width={width}
            alt={"Sudoku"}
          />
          <div
            className={
              "flex justify-center mt-2 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded p-2"
            }
          >
            <button onClick={() => setImageAndNavigate()}>Scan</button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
export default Upload;
