import React, {useEffect, useRef, useState} from 'react'
import cv from './services/cv'
import CameraSelector from "./CameraSelector";

// We'll limit the processing size to 200px.
const height = 800
const width = 800

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
export default function Sudoku() {
    const [processing, updateProcessing] = useState(false)
    // const videoElement = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgElement = useRef<HTMLImageElement>(null);

    /**
     * In the onClick event we'll capture a frame within
     * the video to pass it to our service.
     */
    async function onClick() {
        updateProcessing(true)
        if (canvasRef !== null) {
            const canvasEl = canvasRef.current
            if (canvasEl !== null) {
                const ctx = canvasEl.getContext('2d')
                if (ctx !== null && imgElement.current !== null) {
                    ctx.drawImage(imgElement.current, 0, 0, width, height)
                    const image = ctx.getImageData(0, 0, width, height)
                    // Load the model
                    await cv.load()
                    // Processing image
                    const processedImage = await cv.sudokuProcessing(image) as { data: { payload: ImageData } }
                    ctx.canvas.height = processedImage.data.payload.height;
                    ctx.canvas.width = processedImage.data.payload.width
                    // Render the processed image to the canvas
                    ctx.putImageData(processedImage.data.payload, 0, 0)
                    updateProcessing(false)
                }
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
            <img width={width} height={height} src={'img/sudoku-original.jpg'} ref={imgElement}/>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                {/*<video className="video" playsInline ref={videoElement}/>*/}
                <button
                    disabled={processing}
                    style={{width: width, padding: 10}}
                    onClick={onClick}
                >
                    {processing ? 'Processing...' : 'Convert'}
                </button>
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                />
            </div>
        </>
    )
}
