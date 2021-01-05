import React, {useRef, useState} from 'react'
import {Button} from 'reactstrap'
import cv from './services/cv'
import SudokuGrid from "./SudokuGrid";

const height = 800
const width = 800

const emptySudoku = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]


export default function Sudoku() {
    const [processing, updateProcessing] = useState(false)

    // Canvas for converting input image to ImageData
    const canvasRef = useRef<HTMLCanvasElement>(null)

    // Canvas for drawing result
    const displayCanvasRef = useRef<HTMLCanvasElement>(null)
    const [outputURL, setOutputURL] = useState<string>();
    const imgElement = useRef<HTMLImageElement>(null);
    const [predictions, setPredictions] = useState<number[][]>()

    async function onClick() {
        updateProcessing(true)

        const canvasEl = canvasRef.current
        const displayCanvas = displayCanvasRef.current
        if (canvasEl !== null && displayCanvas !== null) {
            const ctx = canvasEl.getContext('2d')
            const ctx2 = displayCanvas.getContext('2d')
            if (ctx !== null && imgElement.current !== null && ctx2 !== null) {
                ctx.drawImage(imgElement.current, 0, 0, width, height)
                const image = ctx.getImageData(0, 0, width, height)
                // Load the model
                await cv.load()
                // Processing image

                const result = await cv.sudokuProcessing(image) as { data: { payload: ImageData, predictions: number[][] } }

                ctx2.canvas.height = result.data.payload.height;
                ctx2.canvas.width = result.data.payload.width
                // Render the processed image to the canvas
                ctx2.putImageData(result.data.payload, 0, 0)
                setOutputURL(ctx2.canvas.toDataURL());
                updateProcessing(false)
                setPredictions(result.data.predictions)
            }
        }

    }

    return (
        <>
            <img style={{display: 'none'}} alt={"Test"} width={width} height={height} src={'img/sudoku-original.jpg'}
                 ref={imgElement}/>
            <img style={{maxWidth: '100%'}} alt={"Test"} src={'img/sudoku-original.jpg'}/>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                {/*<video className="video" playsInline ref={videoElement}/>*/}
                <Button
                    disabled={processing}
                    style={{padding: 10}}
                    onClick={onClick}
                >
                    {processing ? 'Processing...' : 'Convert'}
                </Button>

                <canvas
                    style={{display: 'none'}}
                    ref={canvasRef}
                    width={width}
                    height={height}
                />
                <canvas
                    style={{display: 'none'}}
                    ref={displayCanvasRef}
                    width={width}
                    height={height}
                />

            </div>
            <SudokuGrid sudoku={predictions ? predictions : emptySudoku}/>
            {
                outputURL ? (<img style={{maxWidth: '1080px', width: '100%'}} alt={'The undistorted snapshot'}
                                  src={outputURL}/>) : <></>
            }
        </>
    )
}
