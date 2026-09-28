# Neo Audio Visualizer Bridge

Chrome / Edge extension that feeds one browser tab's audio (YouTube Music,
Spotify Web, etc.) into the **[Neo Cyberpunk Audio Visualizer](https://siliconvalley007.github.io/Neo-Cyberpunk-Audio-Visualizer-Web/)** web page,
without the permanent "sharing this tab" bar. Nothing leaves your browser.

![Preview](preview.png)

## Install (Chrome or Edge, ~1 minute)
1. Click **Code → Download ZIP** and extract it.
2. Open `chrome://extensions` (Edge: `edge://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the extracted folder (the one containing `manifest.json`).
5. Pin the extension (puzzle icon → pin).

## Use
1. Open the [visualizer page](https://siliconvalley007.github.io/Neo-Cyberpunk-Audio-Visualizer-Web/) in one tab (press **F11** for fullscreen).
2. Open your music in another tab and play something.
3. **Focus the music tab**, click the extension icon, press **Start**.
4. Switch back to the visualizer tab. Pausing the music shuts the visualizer down.
5. To stop, click the icon while on the shared tab and press **Stop**.

Chrome only allows capturing the tab you are currently on, so always click the icon while the music tab is active.

## Troubleshooting
- **Start error "active stream"**: press Stop, then Start again.
- **Visualizer doesn't react**: hard-reload the visualizer tab (Ctrl+Shift+R) after installing.
- **Can't enable Developer mode**: your browser is managed by an admin policy.

## Host your own copy
Edit both URLs in `manifest.json` to your GitHub Pages URL: `content_scripts → matches`
(`https://YOURUSER.github.io/YOUR-REPO/*`) and `web_accessible_resources → matches`
(`https://YOURUSER.github.io/*`). Then reload the extension.

## Privacy
Audio is analysed locally in your browser and only frequency levels are passed to the visualizer page. No data is stored or sent anywhere.

Companion project: [Neo-Cyberpunk-Audio-Visualizer-Web](https://github.com/SiliconValley007/Neo-Cyberpunk-Audio-Visualizer-Web)