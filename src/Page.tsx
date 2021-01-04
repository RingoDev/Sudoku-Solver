import React, {useEffect, useRef, useState} from 'react'
import cv from './services/cv'
import CameraSelector from "./CameraSelector";


// We'll limit the processing size to 200px.
const height = 800
const width = 800

export default function Page() {
    const [processing, updateProcessing] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [outputURL, setOutputURL] = useState<string>();
    const [videoStream, setVideoStream] = useState<MediaStream | undefined>(undefined);

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

                if (ctx !== null && videoRef.current !== null) {
                    ctx.drawImage(videoRef.current, 0, 0, width, height)
                    const image = ctx.getImageData(0, 0, width, height)
                    // Load the model
                    await cv.load()
                    // Processing image
                    const processedImage = await cv.sudokuProcessing(image) as { data: { payload: ImageData } }

                    ctx.canvas.height = processedImage.data.payload.height;
                    ctx.canvas.width = processedImage.data.payload.width;

                    // Render the processed image to the canvas
                    ctx.putImageData(processedImage.data.payload, 0, 0)
                    setOutputURL(ctx.canvas.toDataURL());
                    updateProcessing(false)
                }
            }
        }
    }

    /**
     * In the useEffect hook we'll load the video
     * element to show what's on camera.
     */
    useEffect(() => {
        async function initCamara() {
            const videoElement = videoRef.current;
            if (videoElement !== null) {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    videoElement.srcObject = await navigator.mediaDevices.getUserMedia({video: true,})
                    return new Promise<HTMLVideoElement | null>((resolve) => {
                        if (videoElement !== null) {
                            videoElement.onloadedmetadata = () => {
                                resolve(videoElement)
                            }
                        }
                    })
                }
            }
            const errorMessage =
                'This browser does not support video capture, or this device does not have a camera'
            alert(errorMessage)
            return Promise.reject(errorMessage)
        }

        async function load() {
            const videoLoaded = await initCamara()
            if (videoLoaded !== null) {
                await videoLoaded.play()
            }
        }

        load()
    }, [])


    if (videoStream !== undefined && videoRef.current !== null) {
        console.debug("setting videostream to selected")
        videoRef.current.srcObject = videoStream
    }


    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <video style={{maxWidth: '1080px', width: '100%'}} className="video" autoPlay={true} playsInline={true}
                       ref={videoRef}/>
                <CameraSelector stream={videoStream} setStream={(stream) => setVideoStream(stream)}/>
                <button
                    disabled={processing}
                    style={{padding: 10}}
                    onClick={onClick}
                >
                    {processing ? 'Processing...' : 'Take a photo'}
                </button>
                <canvas
                    style={{display: 'none'}}
                    ref={canvasRef}
                    width={width}
                    height={height}
                />
                {
                    outputURL ? (<img style={{maxWidth: '1080px', width: '100%'}} alt={'The undistorted snapshot'}
                                      src={outputURL}/>) : <></>
                }
            </div>
        </>
    )
}
