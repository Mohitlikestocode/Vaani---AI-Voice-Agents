/**
 * Swara Widget — Embed a voice agent on any website with one line:
 * <script src="http://localhost:3000/widget/swara-widget.js" data-agent="AGENT_ID"></script>
 */
(function () {
  const script = document.currentScript;
  const agentId = script.getAttribute("data-agent");
  const host = script.getAttribute("data-host") || "http://localhost:3000";

  if (!agentId) {
    console.error("Swara Widget: Missing data-agent attribute.");
    return;
  }

  const CHAT_URL = `${host}/chat/${agentId}?embed=true`;

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    #swara-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #0055FF;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 24px rgba(0, 85, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #swara-widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 32px rgba(0, 85, 255, 0.4);
    }
    #swara-widget-btn svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    #swara-widget-frame {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      height: 560px;
      border: none;
      border-radius: 16px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
      z-index: 99998;
      display: none;
      overflow: hidden;
    }
    @media (max-width: 480px) {
      #swara-widget-frame {
        width: calc(100vw - 32px);
        height: calc(100vh - 140px);
        right: 16px;
        bottom: 90px;
      }
    }
  `;
  document.head.appendChild(style);

  // Create chat button
  const btn = document.createElement("button");
  btn.id = "swara-widget-btn";
  btn.title = "Chat with us";
  btn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>`;
  document.body.appendChild(btn);

  // Open chat as popup window (gets full mic permissions unlike iframes)
  let chatWindow = null;
  btn.addEventListener("click", () => {
    if (chatWindow && !chatWindow.closed) {
      chatWindow.focus();
    } else {
      chatWindow = window.open(
        CHAT_URL,
        "swara-chat",
        "width=400,height=620,right=24,bottom=100,resizable=yes,scrollbars=no"
      );
    }
  });
})();
