import React, { InputHTMLAttributes, useEffect, useRef } from 'react';
import Button from "./Button";

interface FileChooserProps extends Omit<React.ComponentProps<typeof Button>, 'onSelect'> {
    onSelect: (files: FileList | null) => void;
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

const FileChooser: React.FC<FileChooserProps> = ({ children, onSelect, inputProps, ...props }) => {
    const inputEl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const element = inputEl.current;
        if (!element) return;

        const handler = (e: Event) => {
            const target = e.target as HTMLInputElement;
            onSelect(target.files);
        };

        element.addEventListener('change', handler, false);
        return () => element.removeEventListener('change', handler, false);
    }, [onSelect]);

    return (
        <>
            <input type={"file"} style={{ display: 'none' }} ref={inputEl} {...inputProps} />
            <Button onClick={() => {
                inputEl.current?.click();
            }} {...props}>
                {children}
            </Button>
        </>
    )
}

export default FileChooser;