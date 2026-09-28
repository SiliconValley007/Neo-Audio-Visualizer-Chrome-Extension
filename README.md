# Neo Audio Visualizer — Chrome/Edge Extension

Streams the audio of one browser tab (YouTube Music, Spotify Web, etc.) into the
live wallpaper page: **https://siliconvalley007.github.io/Neo-Cyberpunk-Audio-Visualizer-Web/**
(source: https://github.com/siliconvalley007/Neo-Cyberpunk-Audio-Visualizer-Web)

No screen-share bar, no installer, nothing leaves your browser.

## Install (Chrome or Edge, ~1 minute)

1. Click **Code → Download ZIP** on this repo and extract it.
2. Open `chrome://extensions` (Edge: `edge://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the extracted folder (the one containing `manifest.json`).
5. Pin the extension (puzzle icon → pin).

## Use

1. Open the wallpaper page in one tab (press **F11** for fullscreen).
2. Open your music in another tab and play something.
3. **Focus the music tab**, click the extension icon, press **Start**.
4. Switch back to the wallpaper tab. Pause the music and the visualizer shuts down;
   press Start again anytime. Reopen the popup on the shared tab to **Stop**.

Chrome only allows capturing the tab you are currently on, so always click the
icon while the music tab is active.

## Troubleshooting

- **Start error "active stream"**: press Stop, then Start again.
- **Wallpaper doesn't react**: hard-reload the wallpaper tab (Ctrl+Shift+R) after installing.
- **Can't turn on Developer mode**: your browser is managed by an admin policy.

## Using your own hosted copy

Edit both `matches`/`resources` URLs in `manifest.json` to your GitHub Pages URL
(keep the trailing `/*`; `web_accessible_resources` must use `https://YOURUSER.github.io/*`), then reload the extension.
