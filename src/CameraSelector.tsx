import React, {useEffect, useRef, useState} from "react";

const CameraSelector: React.FC = () => {

    const selectRef = useRef<HTMLSelectElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => gotDevices(devices))
            .catch((e) => handleError(e));
    }, [])

    function gotDevices(deviceInfos: MediaDeviceInfo[]) {
        console.debug("got devices")
        const selectElement = selectRef.current;
        if (selectElement) {
            console.debug("got here")
            console.debug(deviceInfos)
            for (let i = 0; i !== deviceInfos.length; ++i) {
                const deviceInfo = deviceInfos[i];
                console.debug(deviceInfo)
                if (deviceInfo.kind === 'videoinput' && !devices.includes(deviceInfo)) {
                    setDevices([...devices, deviceInfo])
                    console.debug("Got here")
                }
            }
        }
    }


    function gotStream(stream: MediaStream) {
        // todo send stream to parent

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
                    {devices.map((deviceInfo, index) => {
                        return (
                            <option value={deviceInfo.deviceId} key={deviceInfo.deviceId}>
                                {deviceInfo.label ? deviceInfo.label : ('camera ' + index + 1)}
                            </option>
                        )
                    })}
                </select>
            </div>
        </>
    )
}

export default CameraSelector
