import { useState, FormEvent } from "react";

interface ApiKeyProps {
    onConfigured?: () => void;
    isConfigured: boolean;
    handleSaveKey: (key: string) => void;
}

const ApiKey = ({ onConfigured, isConfigured, handleSaveKey }: ApiKeyProps) => {
    const [inputKey, setInputKey] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!inputKey.trim()) return;
        handleSaveKey(inputKey);
        if (onConfigured) {
            onConfigured();
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col mx-4 mt-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Hi! Before we continue...</h3>
            <p className="mt-1 text-md">
                In order to scan your receipts, we need a <span className="font-semibold">Google Gemini API Key</span>
                &nbsp;so that we can use Gemini to scan your receipts!
            </p>
            <p className="mt-1 text-gray-500 text-xs italic">
                Your API key will be stored locally in your browser and is not uploaded to any service.
                <br />
                <br />I would love
                to not have to use any sort of paid service! But local LLM technology has yet to mature and be available... so here we are :)</p>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <input
                    type="password"
                    value={inputKey}
                    onChange={e => setInputKey(e.target.value)}
                    className="flex-1 input"
                    placeholder="AIzaSy..."
                />
                {isConfigured && onConfigured && (
                    <button
                        type="button"
                        onClick={onConfigured}
                        className="button secondary whitespace-nowrap"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="button primary whitespace-nowrap"
                >
                    Save Key
                </button>
            </form>

            <p className="text-[10px] text-gray-400 mt-2">
                Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline text-blue-600">Google AI Studio</a>.
            </p>
        </div>
    );
};

export default ApiKey;
