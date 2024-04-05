import React, { useRef, useState } from "react";
import cv from "../../lib/services/cv";

// We'll limit the processing size to 200px.
const maxVideoSize = 200;

/**
 * What we're going to render is:
 *
 * 1. A video component so the user can see what's on the camera.
 *
 * 2. A button to generate an image of the video, load OpenCV and
 * process the image.
 *
 * 3. A canvas to allow us to capture the image of the video and
 * show it to the user.
 */
export default function StaticImage() {
  const [processing, updateProcessing] = useState(false);
  // const videoElement = useRef<HTMLVideoElement>(null)
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const imgElement = useRef<HTMLImageElement>(null);

  /**
   * In the onClick event we'll capture a frame within
   * the video to pass it to our service.
   */
  async function onClick() {
    updateProcessing(true);

    if (canvasEl !== null && canvasEl.current !== null) {
      const ctx = canvasEl.current.getContext("2d");
      if (ctx !== null && imgElement.current !== null) {
        ctx.drawImage(imgElement.current, 0, 0);
        const image = ctx.getImageData(
          0,
          0,
          imgElement.current.width,
          imgElement.current.height,
        );
        // Load the model
        await cv.load();
        // Processing image
        const processedImage = (await cv.imageProcessing(image)) as {
          data: { payload: ImageData };
        };
        // Render the processed image to the canvas
        ctx.putImageData(processedImage.data.payload, 0, 0);
        updateProcessing(false);
      }
    }
  }

  /**
   * In the useEffect hook we'll load the video
   * element to show what's on camera.
   */
  // useEffect(() => {
  //     async function initCamara() {
  //         if (videoElement.current !== null) {
  //             videoElement.current.width = maxVideoSize
  //             videoElement.current.height = maxVideoSize
  //             if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //                 videoElement.current.srcObject = await navigator.mediaDevices.getUserMedia({
  //                     audio: false,
  //                     video: {
  //                         facingMode: 'user',
  //                         width: maxVideoSize,
  //                         height: maxVideoSize,
  //                     },
  //                 })
  //                 return new Promise<HTMLVideoElement | null>((resolve) => {
  //                     if (videoElement.current !== null) {
  //                         videoElement.current.onloadedmetadata = () => {
  //                             resolve(videoElement.current)
  //                         }
  //                     }
  //                 })
  //             }
  //         }
  //         const errorMessage =
  //             'This browser does not support video capture, or this device does not have a camera'
  //         alert(errorMessage)
  //         return Promise.reject(errorMessage)
  //     }
  //
  //     async function load() {
  //         const videoLoaded = await initCamara()
  //         if (videoLoaded !== null) {
  //             await videoLoaded.play()
  //         }
  //     }
  //
  //     load()
  // }, [])

  return (
    <>
      <img
        alt={"a picture of a sudoku"}
        src={"img/test.jpg"}
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
        {/*<video className="video" playsInline ref={videoElement}/>*/}
        <button
          disabled={processing}
          style={{ width: maxVideoSize, padding: 10 }}
          onClick={onClick}
        >
          {processing ? "Processing..." : "Convert"}
        </button>
        <canvas ref={canvasEl} width={maxVideoSize} height={maxVideoSize} />
      </div>
    </>
  );
}
