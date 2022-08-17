import React, {useEffect, useRef} from 'react';
import Button from "./Button";

const FileChooser = ({children, onSelect, inputProps, ...props}) => {
    const inputEl = useRef(null);

    useEffect(() => {
        inputEl.current.addEventListener('change', e => {
            onSelect(e.target.files);
        }, false);
    }, [onSelect]);

    return (
        <>
            <input type={"file"} style={{display: 'none'}} ref={inputEl} {...inputProps}/>
            <Button onClick={() => {
                inputEl.current.click();
            }} {...props}>
                {children}
            </Button>
        </>
    )
}

export default FileChooser;