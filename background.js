async function hasOffscreen() {
  const c = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
  });
  return c.length > 0;
}

async function relayToVisualizer(msg) {
  const { visualizerTabId } =
    await chrome.storage.session.get("visualizerTabId");
  if (visualizerTabId != null)
    chrome.tabs.sendMessage(visualizerTabId, msg).catch(() => {});
}

async function clearCaptured() {
  await chrome.storage.session.remove("capturedTabId");
}

async function resetOffscreen() {
  if (await hasOffscreen()) {
    await chrome.offscreen.closeDocument().catch(() => {});
    await new Promise((r) => setTimeout(r, 200));
  }
  await clearCaptured();
  relayToVisualizer({ type: "stop" });
}

async function handleStart(streamId, tabId) {
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["USER_MEDIA"],
    justification: "Analyze captured tab audio for the visualizer",
  });
  await new Promise((r) => setTimeout(r, 150));
  await chrome.storage.session.set({ capturedTabId: tabId });
  chrome.runtime.sendMessage({ type: "offscreen-start", streamId });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case "register-visualizer":
      chrome.storage.session.set({ visualizerTabId: sender.tab.id });
      break;
    case "bands":
      relayToVisualizer(msg);
      break;
    case "stop": // capture ended on its own (tab closed / stream ended)
      clearCaptured();
      relayToVisualizer(msg);
      break;
    case "reset-and-wait":
    case "popup-stop-capture":
      resetOffscreen().then(() => sendResponse({ ok: true }));
      return true;
    case "start-with-stream-id":
      handleStart(msg.streamId, msg.tabId).then(() =>
        sendResponse({ ok: true }),
      );
      return true;
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const { capturedTabId } = await chrome.storage.session.get("capturedTabId");
  if (capturedTabId === tabId) resetOffscreen();
});
