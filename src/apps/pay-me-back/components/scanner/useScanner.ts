import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

export type Item = {
    name: string;
    price: string;
    participants: string[];
};

export type ScanResult = {
    errorReason?: string;
    items: Item[];
    tax: number;
    tip: number;
};

const getFriendlyErrorMessage = (err: any): string => {
    if (!err) return "An unknown error occurred.";

    const rawMessage = err.message || String(err);

    // Attempt to parse Google API JSON error
    try {
        if (typeof rawMessage === "string" && rawMessage.trim().startsWith("{")) {
            const parsed = JSON.parse(rawMessage);
            if (parsed && parsed.error) {
                const apiError = parsed.error;
                const status = apiError.status;
                const apiMessage = apiError.message || "";

                // Check details for specific error reasons
                const details = apiError.details || [];
                const isApiKeyInvalid = details.some((d: any) => d.reason === "API_KEY_INVALID") ||
                    apiMessage.toLowerCase().includes("api key not valid") ||
                    apiMessage.toLowerCase().includes("invalid api key");

                if (isApiKeyInvalid) {
                    return "The API key you provided is invalid. Please check your Gemini API key and try again.";
                }

                if (status === "RESOURCE_EXHAUSTED" || apiMessage.toLowerCase().includes("quota")) {
                    return "Gemini API rate limit or quota exceeded. Please wait a moment and try again.";
                }

                if (apiMessage) {
                    return apiMessage;
                }
            }
        }
    } catch (e) {
        // Fallback to text matching if parsing failed
    }

    // String matching on raw message
    const lowercaseMsg = rawMessage.toLowerCase();
    if (lowercaseMsg.includes("api_key_invalid") || lowercaseMsg.includes("api key not valid") || lowercaseMsg.includes("invalid api key")) {
        return "The API key you provided is invalid. Please check your Gemini API key and try again.";
    }

    if (lowercaseMsg.includes("quota") || lowercaseMsg.includes("resource_exhausted") || lowercaseMsg.includes("rate limit")) {
        return "Gemini API rate limit or quota exceeded. Please wait a moment and try again.";
    }

    return rawMessage || "Failed to scan receipt. Please verify your internet connection and API key.";
};

const useScanner = () => {
    const [apiKey, setApiKey] = useState("");
    const [isConfigured, setIsConfigured] = useState(false);
    const [status, setStatus] = useState<"idle" | "scanning" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const savedKey = localStorage.getItem("gemini_api_key");
        if (savedKey) {
            setApiKey(savedKey);
            setIsConfigured(true);
        }
    }, []);

    const handleSaveKey = useCallback((key: string) => {
        if (!key.trim()) return;
        localStorage.setItem("gemini_api_key", key.trim());
        setApiKey(key.trim());
        setIsConfigured(true);
    }, []);

    const handleClearKey = useCallback(() => {
        localStorage.removeItem("gemini_api_key");
        setApiKey("");
        setIsConfigured(false);
        setErrorMsg("");
        setStatus("idle");
    }, []);

    const scanReceipt = useCallback(async (file: File): Promise<ScanResult> => {
        const keyToUse = apiKey || localStorage.getItem("gemini_api_key") || "";
        if (!keyToUse) {
            console.error("[useScanner] Attempted to scan without an API Key configured.");
            throw new Error("API Key is not configured");
        }

        console.log(`[useScanner] Starting receipt scan. File: "${file.name}" | Type: ${file.type || 'image/jpeg'} | Size: ${file.size} bytes`);
        setStatus("scanning");
        setErrorMsg("");

        try {
            // Convert file to base64
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    // remove the data:image/jpeg;base64, prefix
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            console.log("[useScanner] Successfully converted image to base64 encoding.");

            const prompt = `Extract all the items, their prices, the total tax, and the total tip from this receipt.
Ignore subtotals and final totals. 
IMPORTANT RULES:
1. The receipt has items on the left and prices on the right. Some items on the left DO NOT have a price next to them. Do NOT just match the 1st name to the 1st price. You MUST match the price to the text on the EXACT SAME horizontal line in the image.
2. If an item name spans multiple lines (e.g. "Rack of Lamb" on line 1 with no price, and "Medium" on line 2 with a price), combine them into a single item: "Rack of Lamb (Medium)" and use the price.
3. If an item has add-ons listed below it with their OWN additional prices, SUM those prices into the base item's price and combine the names.`;

            const ai = new GoogleGenAI({ apiKey: keyToUse });

            console.log("[useScanner] Sending content generation request to Gemini (gemini-3-flash-preview)...");
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    {
                        inlineData: {
                            mimeType: file.type || "image/jpeg",
                            data: base64Data
                        }
                    },
                    prompt
                ],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            errorReason: { type: "STRING", description: "Reason why receipt could not be parsed if there is an issue" },
                            items: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        name: { type: "STRING" },
                                        price: { type: "STRING", description: "The price of the item as a string value (e.g. '12.99')" }
                                    },
                                    required: ["name", "price"]
                                }
                            },
                            tax: { type: "NUMBER", description: "The tax amount extracted from the receipt. If not found or zero, return 0." },
                            tip: { type: "NUMBER", description: "The tip amount extracted from the receipt. If not found or zero, return 0." }
                        },
                        required: ["items", "tax", "tip"]
                    },
                    thinkingConfig: {
                        thinkingLevel: ThinkingLevel.MEDIUM
                    }
                }
            });

            let textOutput = response.text || "";
            console.log("[useScanner] Received response from Gemini. Raw Output:\n", textOutput);

            const resultObj = JSON.parse(textOutput);

            // Map parsed items to include empty participants list
            const items = (resultObj.items || []).map((item: any) => ({
                name: item.name || "Unknown Item",
                price: item.price || "0.00",
                participants: []
            }));

            const finalResult: ScanResult = {
                errorReason: resultObj.errorReason,
                items: items,
                tax: typeof resultObj.tax === "number" ? resultObj.tax : 0,
                tip: typeof resultObj.tip === "number" ? resultObj.tip : 0
            };

            console.log("[useScanner] Final parsed result object:", finalResult);

            if (finalResult.errorReason) {
                throw new Error(finalResult.errorReason);
            }

            if (finalResult.items.length === 0) {
                throw new Error("Output contained no valid items.");
            }

            setStatus("idle");
            return finalResult;

        } catch (err: any) {
            console.error("[useScanner] Error during scanning/parsing flow:", err);
            setErrorMsg(getFriendlyErrorMessage(err));
            setStatus("error");
            throw err;
        }
    }, [apiKey]);

    return {
        apiKey,
        isConfigured,
        status,
        errorMsg,
        handleSaveKey,
        handleClearKey,
        scanReceipt
    };
};

export default useScanner;
