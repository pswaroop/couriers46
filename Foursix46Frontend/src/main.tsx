// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";
// //import { initConsentManager } from "./lib/ConsentManager";

// // Initialise the consent manager
// //initConsentManager();

// // Fade out the static placeholder before React renders
// const root = document.getElementById("root")!;
// const placeholder = root.firstElementChild;

// if (placeholder) {
//   // Add fade-out animation
//   placeholder.setAttribute(
//     "style",
//     "transition: opacity 0.3s ease-out; opacity: 1;",
//   );

//   // Start fade after a tiny delay
//   setTimeout(() => {
//     placeholder.setAttribute(
//       "style",
//       "transition: opacity 0.3s ease-out; opacity: 0;",
//     );
//   }, 100);
// }

// // Render React app (will replace placeholder after fade)
// setTimeout(() => {
//   createRoot(root).render(<App />);
// }, 400);
// src/main.tsx
import { ViteReactSSG } from "vite-react-ssg";
import App from "./App.tsx";
import "./index.css";
import { routes } from "./routes";

export const createRoot = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) {
    // ── Catch hydration/runtime errors early ─────────────────────────────
    window.addEventListener("error", (e) => {
      console.error("[APP ERROR]", e.message, e.error);
    });

    window.addEventListener("unhandledrejection", (e) => {
      console.error("[UNHANDLED PROMISE]", e.reason);
    });

    // ── Fade out the loading overlay once React hydrates ──────────────────
    // The overlay lives in index.html outside #root so it never touches
    // the React app itself. We fade it out and then remove it from the DOM.
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 300);
    }
  }
});
