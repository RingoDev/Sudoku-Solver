import React, {useEffect, useRef, useState} from 'react';
import './Scanner.css'

interface ScannerProps{
    scanning:boolean
}

const Scanner: React.FC<ScannerProps> = (props) => {
    const [stream, setStream] = useState<MediaStream | undefined>(undefined)
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio: false, video:{width:1920,height:1080}}).then(stream => setStream(stream));
        return () => {
            console.log("cleaned up");
            if(stream) stream.getTracks().forEach(track => track.stop());
        }
    })


    if(!props.scanning){
        if(videoRef.current !== null && stream !== undefined){
            stream.getTracks().forEach((track) => {
                track.stop()
            })
        }
        return(<></>)
    }




    if (stream !== undefined) {
        if (videoRef.current !== null && videoRef.current.srcObject == null) {
            videoRef.current.srcObject = stream;
            console.log("Got here")
        }

    }


    return (
        <>
            <video id={'videoCapture'} ref={videoRef} autoPlay={true}>

            </video>
        </>
    )
}

export default Scanner;
