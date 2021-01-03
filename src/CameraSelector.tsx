import React, {useEffect, useRef, useState} from "react";

interface CameraSelectorProps {
    setStream: (stream: MediaStream) => void
}

const CameraSelector: React.FC<CameraSelectorProps> = (props) => {

    const selectRef = useRef<HTMLSelectElement>(null);
    const [devices, setDevices] = useState<string[]>([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: true})
            .then((stream) => gotStream(stream))
            .then((devices) => gotDevices(devices))
            .catch((e) => handleError(e));
        //eslint-disable-next-line
    }, [])

    function gotDevices(deviceInfos: MediaDeviceInfo[]) {
        console.debug("got devices")
        const selectElement = selectRef.current;
        if (selectElement) {
            console.debug("got here")
            console.debug(deviceInfos)
            const newDevices = devices.slice()
            for (let i = 0; i !== deviceInfos.length; ++i) {
                const deviceInfo = deviceInfos[i];
                console.debug(deviceInfo)
                if (deviceInfo.kind === 'videoinput' && !devices.includes(deviceInfo.deviceId)) {
                    newDevices.push(deviceInfo.deviceId)
                }
            }
            setDevices(newDevices);
        }
    }


    function gotStream(stream: MediaStream) {
        props.setStream(stream)

        console.debug("Got a Stream")


        // Refresh button list in case labels have become available
        return navigator.mediaDevices.enumerateDevices();
    }

    function handleError(error: any) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    function start() {
        navigator.mediaDevices.getUserMedia({video: true})
            .then((stream) => gotStream(stream))
            .then((devices) => gotDevices(devices))
            .catch((e) => handleError(e));
    }

    return (
        <>
            <div>
                <select ref={selectRef} onChange={() => start()}>
                    {devices.map((deviceId, index) => {
                        return (
                            <option value={deviceId} key={deviceId}>
                                {'camera ' + index + 1}
                            </option>
                        )
                    })}
                </select>
            </div>
        </>
    )
}

export default CameraSelector
