chrome.runtime.sendMessage({ type: "register-visualizer" });
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "bands" || msg.type === "stop") {
    window.dispatchEvent(new CustomEvent("neo-audio-bridge", { detail: msg }));
  }
});

// Classic universal way to run inject.js in the page's real (main) world,
// works on every Chrome version (unlike the declarative "world":"MAIN" key).
const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
s.onload = () => s.remove();
(document.head || document.documentElement).appendChild(s);
