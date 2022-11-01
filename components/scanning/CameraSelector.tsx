import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface CameraSelectorProps {
  setStream: (stream: MediaStream) => void;
  stream?: MediaStream;
}

const CameraSelector: React.FC<CameraSelectorProps> = (props) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => gotStream(stream))
      .then((devices) => gotDevices(devices))
      .catch((e) => handleError(e));
    //eslint-disable-next-line
  }, []);

  function gotDevices(deviceInfos: MediaDeviceInfo[]) {
    console.debug(deviceInfos);
    console.debug("got devices");
    const selectElement = selectRef.current;
    if (selectElement) {
      console.debug("got here");
      console.debug(deviceInfos);
      const newDevices = [];
      for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === "videoinput") {
          newDevices.push(deviceInfo);
        }
      }
      setDevices(newDevices);
    }
  }

  function gotStream(stream: MediaStream) {
    // set Stream in Parent component (and in our props)
    props.setStream(stream);

    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function handleError(error: any) {
    console.log(
      "navigator.MediaDevices.getUserMedia error: ",
      error.message,
      error.name
    );
  }

  function start(event: ChangeEvent<HTMLSelectElement>) {
    // stop old stream
    if (props.stream) {
      props.stream.getTracks().forEach((t) => t.stop());
    }
    // get stream for newly selected device
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: { exact: event.target.value },
        },
      })
      .then((stream) => gotStream(stream))
      .then((devices) => gotDevices(devices))
      .catch((e) => handleError(e));
  }

  return (
    <>
      <div>
        <select ref={selectRef} onChange={(e) => start(e)}>
          {devices.map((info, index) => {
            return (
              <option value={info.deviceId} key={info.deviceId}>
                {info.label ? info.label : "camera " + (index + 1)}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};

export default CameraSelector;
