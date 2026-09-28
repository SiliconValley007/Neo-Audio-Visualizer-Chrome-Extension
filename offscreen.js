const NUM_BANDS = 300,
  F_MIN = 30,
  F_MAX = 15000;
let audioCtx, analyser, stream, raf;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "offscreen-start") {
    start(msg.streamId);
  } else if (msg.type === "offscreen-stop") stop();
});

async function start(streamId) {
  teardown();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: { chromeMediaSource: "tab", chromeMediaSourceId: streamId },
      },
      video: false,
    });
  } catch (e) {
    console.error("[offscreen] getUserMedia FAILED:", e.name, e.message);
    return;
  }
  runAnalysisPipeline();
}

function runAnalysisPipeline() {
  audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);

  const out = audioCtx.createGain();
  source.connect(out);
  out.connect(audioCtx.destination);

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0.35;
  source.connect(analyser);

  const binHz = audioCtx.sampleRate / analyser.fftSize;
  const raw = new Float32Array(analyser.frequencyBinCount);
  const ranges = [];
  for (let j = 0; j < NUM_BANDS; j++) {
    const fLo = F_MIN * Math.pow(F_MAX / F_MIN, j / NUM_BANDS);
    const fHi = F_MIN * Math.pow(F_MAX / F_MIN, (j + 1) / NUM_BANDS);
    let lo = Math.max(1, Math.floor(fLo / binHz));
    let hi = Math.max(lo, Math.ceil(fHi / binHz));
    hi = Math.min(hi, raw.length - 1);
    ranges.push([lo, hi]);
  }

  stream.getAudioTracks()[0].addEventListener("ended", () => {
    stop();
  });

  function loop() {
    analyser.getFloatFrequencyData(raw);
    const bands = new Array(NUM_BANDS);
    for (let j = 0; j < NUM_BANDS; j++) {
      const [lo, hi] = ranges[j];
      let m = -200;
      for (let k = lo; k <= hi; k++) if (raw[k] > m) m = raw[k];
      // dB -> linear magnitude (what Lively supplies); modest fixed gain, no gamma/tilt
      const v = Math.min(1, Math.pow(10, m / 20) * 6);
      bands[j] = v;
    }
    chrome.runtime.sendMessage({ type: "bands", bands });
  }
  raf = setInterval(loop, 16);
}

function teardown() {
  clearInterval(raf);
  if (stream) stream.getTracks().forEach((t) => t.stop());
  if (audioCtx) audioCtx.close();
  stream = audioCtx = analyser = null;
}

function stop() {
  teardown();
  chrome.runtime.sendMessage({ type: "stop" });
}
