Technical Specification: OLED-Based Dynamic Backlight Utility for Film Scanning
1. Context and Problem Statement
When digitizing color negative film (e.g., Kodak UltraMax 400) using a digital camera and an OLED smartphone screen as a backlight, a severe color crossover issue occurs during the inversion process (specifically when using Negative Lab Pro and Lightroom).

Color negative film contains a dense, built-in orange mask. When illuminated by a standard "pure white" screen (RGB 255, 255, 255), the orange mask acts as a heavy filter, blocking the majority of the blue light. Consequently, the digital camera's blue channel is severely underexposed compared to the red and green channels.

When attempting to neutralize this in post-processing, the RAW engine hits its absolute lower limit (2000K) and fails to achieve a neutral white balance. This mathematically mangled data causes the inversion algorithm to produce a prominent red/magenta color cast, particularly in the midtones (skin tones).

2. The Optical Solution
While OLED displays are highly beneficial for scanning due to their discrete, narrow-band RGB spectral spikes (which align well with film dye layers and prevent color bleeding), the ratio of the emitted light must be altered.

To solve the 2000K floor issue, the backlight must act as a digital color correction gel. By emitting a heavily cyan/blue light, the backlight optically neutralizes the film's orange mask before it hits the camera sensor. This feeds the blue channel the light it requires, keeping the RAW white balance in the safe 3500K–4500K range and ensuring clean mathematical inversion.

3. Application Requirements
The requested software is a lightweight, local web application (or native utility) that turns an OLED smartphone display into a programmable, color-correcting light source.

3.1. Core Features
Fullscreen Color Canvas: The primary UI must be a solid, edge-to-edge color block filling 100% of the viewport.

Independent RGB Controls: Three slider inputs (type="range", values 0 to 255) to control the Red, Green, and Blue output of the canvas independently.

Hideable UI (Critical): The control sliders and buttons must be completely hideable (e.g., via a screen tap to toggle visibility). When hidden, the screen must display only the solid color canvas with no status bars, buttons, or text.

Default Initialization: The app should initialize with a strong cyan/blue output to counteract the orange mask immediately. Suggested default: rgb(0, 180, 255).

3.2. Hardware & Browser APIs
To function effectively as a continuous lighting tool, the application must interact with device-level APIs:

Screen Wake Lock API: The application must request and maintain a wake lock (navigator.wakeLock.request('screen')) to prevent the device screen from dimming or sleeping during a scanning session.

Fullscreen API: The app should launch into true fullscreen mode (Element.requestFullscreen()) to hide the browser UI and OS status bar.

Max Brightness (If native/supported): The screen must be forced to maximum brightness to defeat OS auto-dimming and minimize OLED PWM (Pulse Width Modulation) flicker, which can cause banding in scans at faster shutter speeds.

3.3. State Management (Presets)
Different film stocks have different mask densities (e.g., UltraMax 400 is very dense; Portra 160 is relatively thin).

Implement localStorage to save and recall RGB values.

Include UI to save the current RGB state as a named preset (e.g., "UltraMax 400", "Fuji C200").

4. Expected User Flow
The user launches the app and mounts their film 2–3 cm above the phone screen.

The user looks at their camera's Live View histogram and adjusts the app's RGB sliders until the unexposed film border reads as a neutral, flat gray.

The user saves these RGB values as a preset.

The user taps the screen to hide the UI, leaving only the pure, color-calibrated backlight.

The user exposes the digital camera to the right (ETTR), pushing the film border just below highlight clipping.
