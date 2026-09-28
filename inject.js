window.addEventListener("neo-audio-bridge", (e) => {
  if (typeof window.livelyAudioListener !== "function") {
    console.warn("[NeoWP bridge] livelyAudioListener not found yet");
    return;
  }
  const msg = e.detail;
  if (msg.type === "bands")
    window.livelyAudioListener(Float32Array.from(msg.bands));
  else if (msg.type === "stop")
    window.livelyAudioListener(new Float32Array(64));
});
