import { useEffect, useRef, useState } from "react";
import styles from "./RecieptScanner.module.css";
import cameraStyles from "./Camera.module.css";

interface CameraProps {
    onCapture: (file: File) => void;
    onCancel: () => void;
    status: "idle" | "scanning" | "error";
    errorMsg: string;
}

const Camera = ({ onCapture, onCancel, status, errorMsg }: CameraProps) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [visible, setVisible] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (video) {
            const width = video.videoWidth;
            const height = video.videoHeight;
            if (width && height) {
                setAspectRatio(width / height);
                setLoaded(true);
            }
        }
    };

    const handleCapture = () => {
        const video = videoRef.current;
        if (!video || !stream) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });

                    // Stop stream tracks immediately
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);

                    onCapture(file);
                }
            }, "image/jpeg");
        }
    };

    const handleCancel = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        onCancel();
    };

    // Camera stream life-cycle
    useEffect(() => {
        let activeStream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                setCameraError(null);
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    setCameraError("Camera access requires a secure connection (HTTPS or localhost). If testing locally on mobile, you need to use HTTPS or configure Chrome flags.");
                    return;
                }
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                activeStream = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setCameraError("Unable to access the camera. Please verify camera permissions.");
            }
        };

        startCamera();

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div
            className={styles.ContentPanel}
            data-visible={visible}
            onClick={e => e.stopPropagation()}
        >
            <div
                className={cameraStyles.Container}
                data-loaded={cameraError ? "true" : (loaded ? "true" : "false")}
            >
                <div className={cameraStyles.Tip}>
                    Try to take a picture of just the itemized list portion of the receipt! Include lines like tax and tip.
                </div>

                <div className={cameraStyles.Preview}>
                    {cameraError ? (
                        <div className="text-red-500 text-sm p-4 text-center">{cameraError}</div>
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            onLoadedMetadata={handleLoadedMetadata}
                            style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : {}}
                            className="w-full max-h-96 object-contain rounded bg-black"
                        />
                    )}

                    {status === "error" && (
                        <div className="mt-3 text-xs text-red-600 p-2 bg-red-50 rounded border border-red-200 w-full text-center">
                            <strong>Error:</strong> {errorMsg}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex gap-4">
                <button className={styles.OptionButton} onClick={handleCancel}>
                    Cancel
                </button>
                <button
                    className={styles.OptionButton}
                    onClick={handleCapture}
                    disabled={!!cameraError || status === "scanning"}
                >
                    {status === "scanning" ? "Scanning..." : "Scan"}
                </button>
            </div>
        </div>
    );
};

export default Camera;
