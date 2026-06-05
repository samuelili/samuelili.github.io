import { useState, useEffect, useRef } from "react";
import "./styles.css";

interface Preset {
  name: string;
  r: number;
  g: number;
  b: number;
}

const DEFAULT_PRESETS: Preset[] = [
  { name: "Cyan/Blue (Default)", r: 0, g: 180, b: 255 },
  { name: "Pure White", r: 255, g: 255, b: 255 },
];

const FilmScanLight = () => {
  // Color channel states
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(180);
  const [blue, setBlue] = useState(255);

  const [presetName, setPresetName] = useState("");

  // Refs for DOM and APIs
  const containerRef = useRef<HTMLDivElement>(null);
  const wakeLockSentinel =
    useRef<Awaited<ReturnType<typeof navigator.wakeLock.request>>>(null);

  // Load custom presets
  const [presets, setPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem("film-scan-presets");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse presets:", e);
      }
    }
    return DEFAULT_PRESETS;
  });

  // Track if current color matches any preset (for the dropdown)
  const currentPresetName =
    presets.find((p) => p.r === red && p.g === green && p.b === blue)?.name ||
    "custom";

  // Wake Lock handler
  const requestWakeLock = async () => {
    if ("wakeLock" in navigator) {
      try {
        wakeLockSentinel.current = await navigator.wakeLock.request("screen");
      } catch (err) {
        console.warn("Screen Wake Lock request failed:", err);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockSentinel.current) {
      try {
        await wakeLockSentinel.current.release();
        wakeLockSentinel.current = null;
      } catch (err) {
        console.error("Wake Lock release error:", err);
      }
    }
  };

  // Fullscreen event listener to sync state (handles Esc / device gestures)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (!isCurrentlyFullscreen) {
        releaseWakeLock();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      releaseWakeLock();
    };
  }, []);

  // Enter backlight full screen mode
  const enterLightMode = async () => {
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        await requestWakeLock();
      } catch (err) {
        console.error("Failed to enter fullscreen:", err);
      }
    }
  };

  // Exit backlight mode
  const exitLightMode = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Failed to exit fullscreen:", err);
      }
    }
    await releaseWakeLock();
  };

  // Preset management
  const handlePresetSelect = (name: string) => {
    const selected = presets.find((p) => p.name === name);
    if (selected) {
      setRed(selected.r);
      setGreen(selected.g);
      setBlue(selected.b);
    }
  };

  const handleSavePreset = () => {
    const trimmedName = presetName.trim();
    if (!trimmedName) return;

    if (trimmedName === "Cyan/Blue (Default)" || trimmedName === "Pure White") {
      alert("Cannot overwrite default presets.");
      return;
    }

    const newPreset: Preset = { name: trimmedName, r: red, g: green, b: blue };
    const updated = [
      ...presets.filter((p) => p.name !== trimmedName),
      newPreset,
    ];
    setPresets(updated);
    localStorage.setItem("film-scan-presets", JSON.stringify(updated));
    setPresetName("");
  };

  const handleDeletePreset = (nameToDelete: string) => {
    if (nameToDelete === "Cyan/Blue (Default)" || nameToDelete === "Pure White")
      return;
    const updated = presets.filter((p) => p.name !== nameToDelete);
    setPresets(updated);
    localStorage.setItem("film-scan-presets", JSON.stringify(updated));
  };

  return (
    <>
      <p className="font-bold text-xl">phone {"->"} film scanner light</p>
      <p>i'm cheaping out, so my phone is my film scanning light</p>

      <p className="mt-4 font-semibold">settings</p>

      {/* Manual RGB Sliders */}
      <div className="mt-4 flex gap-4">
        <div>
          <div className="flex items-center gap-2">
            <label>Red: {red}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={red}
              onChange={(e) => setRed(Number(e.target.value))}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label>Green: {green}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={green}
              onChange={(e) => setGreen(Number(e.target.value))}
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <label>Blue: {blue}</label>
            <input
              type="range"
              min="0"
              max="255"
              value={blue}
              onChange={(e) => setBlue(Number(e.target.value))}
            />
          </div>
        </div>

        <div
          className="w-24 h-24"
          style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
        ></div>
      </div>

      {/* Preset Dropdown */}
      <div className="mt-4">
        <label>Presets: </label>
        <select
          value={currentPresetName}
          onChange={(e) => handlePresetSelect(e.target.value)}
        >
          <option value="custom" disabled={currentPresetName !== "custom"}>
            {currentPresetName === "custom" ? "Custom" : "-- Select Preset --"}
          </option>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>

        {currentPresetName !== "custom" &&
          currentPresetName !== "Cyan/Blue (Default)" &&
          currentPresetName !== "Pure White" && (
            <button
              onClick={() => handleDeletePreset(currentPresetName)}
              style={{ marginLeft: "0.5rem", cursor: "pointer" }}
            >
              Delete
            </button>
          )}
      </div>

      {/* Save Preset Form */}
      <div className="mt-2">
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="New preset name"
          style={{ fontSize: "0.8rem" }}
        />
        <button
          onClick={handleSavePreset}
          disabled={!presetName.trim()}
          style={{
            marginLeft: "0.5rem",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Save Preset
        </button>
      </div>

      <div className="mt-8">
        <i>double click to exit</i>
      </div>

      {/* Fullscreen Button */}
      <button onClick={enterLightMode} className="let-it-glow text-glow">
        ______________________
        <br />| LET THERE BE LIGHT |<br />
        ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
      </button>

      <div
        className="flashbang"
        style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
        ref={containerRef}
        onDoubleClick={exitLightMode}
      />
    </>
  );
};

export default FilmScanLight;
