import { useState, useEffect, useRef } from "react";
import styles from "./RecieptScanner.module.css";
import { IconCamera, IconUpload, IconKey } from "@tabler/icons-react";
import Camera from "./Camera";
import ApiKey from "./ApiKey";

enum Step {
    NONE,
    API_KEY,
    CHOICE,
    CAMERA
}

interface ReceiptScannerStepsProps {
    open: boolean;
    onClose: () => void;
    onFileSelected: (file: File) => void;
    isConfigured: boolean;
    handleSaveKey: (key: string) => void;
}

const ReceiptScannerSteps = ({ open, onClose, onFileSelected, isConfigured, handleSaveKey }: ReceiptScannerStepsProps) => {
    const [step, setStep] = useState<Step>(Step.NONE);
    const [visible, setVisible] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track active/visible states on mount/open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            // Delay slightly to trigger transition in
            const timer = setTimeout(() => {
                setVisible(true);
                setStep(isConfigured ? Step.CHOICE : Step.API_KEY);
            }, 50);
            return () => {
                clearTimeout(timer);
            };
        } else {
            document.body.style.overflow = "";
            setVisible(false);
            setStep(Step.NONE);
        }
    }, [open, isConfigured]);

    // Ensure cleanup of overflow style when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleClose = () => {
        setVisible(false);
        setStep(Step.NONE);
        // Wait for CSS transition (320ms) before actual unmount
        setTimeout(() => {
            onClose();
        }, 320);
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileSelected(file);
        handleClose();
    };

    const handleCameraCapture = (file: File) => {
        onFileSelected(file);
        handleClose();
    };

    if (!open && !visible) {
        return null;
    }

    return (
        <div
            className={styles.Root}
            data-open={visible ? "true" : "false"}
            onClick={handleClose}
        >
            {/* Hidden upload input */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                onClick={e => e.stopPropagation()}
            />

            <div
                className={styles.ContentPanel}
                data-visible={step === Step.CHOICE}
                onClick={e => e.stopPropagation()}
            >
                <button className={styles.ChangeApiKeyButton} onClick={() => setStep(Step.API_KEY)}>
                    <IconKey size={14} />
                    Change API Key
                </button>
                <div className={"mt-4 flex gap-4"}>
                    <button className={styles.OptionButton} onClick={() => setStep(Step.CAMERA)}>
                        <IconCamera />
                        Take Picture
                    </button>

                    <button className={styles.OptionButton} onClick={handleUpload}>
                        <IconUpload />
                        Upload
                    </button>
                </div>
            </div>

            <div
                className={styles.ContentPanel}
                data-visible={step === Step.API_KEY}
                onClick={e => e.stopPropagation()}
            >
                <ApiKey
                    onConfigured={() => setStep(Step.CHOICE)}
                    isConfigured={isConfigured}
                    handleSaveKey={handleSaveKey}
                />
            </div>

            {step === Step.CAMERA && (
                <Camera
                    onCapture={handleCameraCapture}
                    onCancel={() => setStep(Step.CHOICE)}
                    status="idle"
                    errorMsg=""
                />
            )}
        </div>
    );
};

export default ReceiptScannerSteps;
