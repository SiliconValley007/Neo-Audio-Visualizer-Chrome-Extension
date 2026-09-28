const tabNameEl = document.getElementById("tabName");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
let currentTab = null;

async function getCapturedTabId() {
  const ctx = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
  });
  if (!ctx.length) return null;
  const { capturedTabId } = await chrome.storage.session.get("capturedTabId");
  return capturedTabId ?? null;
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  tabNameEl.textContent = tab ? tab.title || tab.url : "No active tab";
  const capId = await getCapturedTabId();

  if (capId != null && tab && capId === tab.id) {
    statusEl.textContent =
      "✅ This tab is already being shared. Press Stop to end.";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } else if (capId != null) {
    let other = "another tab";
    try {
      other =
        '"' + ((await chrome.tabs.get(capId)).title || "another tab") + '"';
    } catch (e) {}
    statusEl.textContent =
      "Currently sharing " + other + ". Start here to switch, or Stop.";
    startBtn.textContent = "Switch to this tab";
    startBtn.disabled = false;
    stopBtn.disabled = false;
  } else {
    statusEl.textContent =
      "Switch to your music tab first, then open this popup.";
    startBtn.textContent = "Start";
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

startBtn.addEventListener("click", async () => {
  if (!currentTab) return;
  statusEl.textContent = "Starting…";
  try {
    // Release any previous stream first (else: "Cannot capture a tab with an active stream").
    await chrome.runtime.sendMessage({ type: "reset-and-wait" });
    const streamId = await chrome.tabCapture.getMediaStreamId({
      targetTabId: currentTab.id,
    });
    await chrome.runtime.sendMessage({
      type: "start-with-stream-id",
      streamId,
      tabId: currentTab.id,
    });
    await init();
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  }
});

stopBtn.addEventListener("click", async () => {
  statusEl.textContent = "Stopping…";
  await chrome.runtime.sendMessage({ type: "popup-stop-capture" });
  await init();
});

init();
