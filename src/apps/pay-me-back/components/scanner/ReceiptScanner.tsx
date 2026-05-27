import { useState } from 'react';
import useScanner from './useScanner';
import styles from "./ReceiptScannerBox.module.css";
import { IconCamera, IconArrowNarrowDownDashed, IconLoader2 } from '@tabler/icons-react';
import ReceiptScannerSteps from './ReceiptScannerSteps';

type Item = {
    name: string;
    price: string;
    participants: string[];
};

export default function ReceiptScanner({ onScanResult, className }: { onScanResult: (items: Item[], tax?: number, tip?: number) => void, className?: string }) {
    const [scannerOpen, setScannerOpen] = useState(false);
    const { status, errorMsg, scanReceipt } = useScanner();

    const handleFileSelected = async (file: File) => {
        try {
            const result = await scanReceipt(file);
            onScanResult(result.items, result.tax, result.tip);
        } catch (err) {
            // Error state is managed by the hook
        }
    };

    return (
        <>
            <button
                className={`${styles.Container} ${status === "scanning" ? "pointer-events-none opacity-80" : ""} ${className}`}
                onClick={() => setScannerOpen(true)}
                disabled={status === "scanning"}
            >
                {status === "scanning" ? (
                    <>
                        <IconLoader2 className="animate-spin" strokeWidth={1.5} size={32} style={{ color: 'var(--primary)' }} />
                        <span className="mt-2 text-sm font-medium">
                            Gemini is scanning your receipt...
                        </span>
                    </>
                ) : (
                    <>
                        <IconCamera strokeWidth={1} />
                        <span className="mt-1 text-sm">
                            Scan a receipt to auto-fill
                        </span>
                        <span className="mt-4 flex gap-1 items-center text-xs italic">
                            <span>
                                or type items yourself
                            </span>
                            <IconArrowNarrowDownDashed size={20} />
                        </span>
                    </>
                )}
            </button>

            {status === "error" && (
                <div className="mt-3 text-xs text-red-600 p-2 bg-red-50 rounded border border-red-200 text-center">
                    <strong>Error:</strong> {errorMsg}
                </div>
            )}

            <ReceiptScannerSteps
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onFileSelected={handleFileSelected}
            />
        </>
    );
}
