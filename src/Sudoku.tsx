import React, {useEffect, useRef, useState} from 'react'
import cv from './services/cv'

const height = 800
const width = 800


export default function Sudoku() {
    const [processing, updateProcessing] = useState(false)
    // const videoElement = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgElement = useRef<HTMLImageElement>(null);

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
