import React, {useEffect, useRef, useState} from 'react';
import FileChooser from "../components/FileChooser";
import moment from "moment";
import download from 'downloadjs';
import html2canvas from "html2canvas";

import '../styles/insta-generator.css';
import Button from "../components/Button";

const FilePreview = ({file, onChange}) => {
    const imgRef = useRef(null);

    useEffect(() => {
        const imgEl = imgRef.current;
        const reader = new FileReader();

        imgEl.title = file.name;

        reader.onload = e => imgEl.src = e.target.result;

        reader.readAsDataURL(file.raw);
    }, [file]);

    return (
        <div className={"DiffusedBox"} style={{display: 'flex', alignItems: "center"}}>
            <div>
                <img width={128} ref={imgRef} alt={""}/>
            </div>
            <div style={{marginLeft: 8}}>
                {file.name}
            </div>
            <input type={'text'} defaultValue={file.date} style={{marginLeft: 4}} onChange={onChange}/>
        </div>
    )
}

const InstaGenerator = () => {
    const HORIZONTAL_BOUND = 2160 - 2 * 128;
    const VERTICAL_BOUND = 2160 - 2 * 128;
    const canvasRef = useRef(null);
    const frameRef = useRef(null);
    const dateRef = useRef(null);

    const [files, setFiles] = useState([]);


    const processImage = (file, date) => {
        let frame = frameRef.current;
        let dateText = dateRef.current;
        let canvas = canvasRef.current;
        let ctx = canvas.getContext('2d');

        let reader = new FileReader();
        reader.onload = function (event) {
            let img = new Image();
            img.onload = function () {
                let aspectRatio = img.width / img.height;
                if (img.height > img.width) {
                    canvas.width = VERTICAL_BOUND * aspectRatio;
                    canvas.height = VERTICAL_BOUND;
                } else {
                    canvas.width = HORIZONTAL_BOUND;
                    canvas.height = HORIZONTAL_BOUND * Math.pow(aspectRatio, -1);
                }
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                dateText.innerText = date;

                html2canvas(frame).then((canvas) => {
                    const base64image = canvas.toDataURL("image/png");
                    download(base64image, `${file.name}-framed.png`, "image/png");
                });
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }

    const processImages = () => {
        for (let i = 0; i < files.length; i++)
            processImage(files[i].raw, files[i].date);
    }

    return (
        <>
            <div id={"frame"} ref={frameRef}>
                <canvas id="image-canvas" ref={canvasRef}>

                </canvas>
                <div id="date" ref={dateRef}>
                </div>
            </div>
            <div className={"DiffusedBox"}>
                <FileChooser onSelect={files => {
                    let selected = [];
                    for (let i = 0; i < files.length; i++) {
                        selected.push({
                            name: files[i].name,
                            date: moment(files[i].lastModified).format("MMM do, YYYY"),
                            raw: files[i]
                        });
                    }
                    setFiles(selected);
                }} inputProps={{
                    name: "image-loader",
                    multiple: true
                }}>
                    Select Images
                </FileChooser>
            </div>

            {files.length > 0 ?
                <>
                    <div className={"DiffusedBox"} style={{marginTop: 16}}>
                        <h3>Modify Dates</h3>

                        {files.map((file, i) =>
                            <FilePreview file={file} key={i} onChange={e => {
                                let newFiles = [...files]; // this is really expensive but whatever
                                newFiles[i].date = e.target.value;
                                setFiles(newFiles);
                            }}/>)}
                    </div>
                    <div className={"DiffusedBox"} style={{marginTop: 16}}>
                        <Button onClick={processImages}>Process Images!</Button>
                    </div>
                </>
                : <></>}
        </>
    )
}

export default InstaGenerator;