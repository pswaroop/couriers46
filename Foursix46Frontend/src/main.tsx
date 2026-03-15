import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Fade out the static placeholder before React renders
const root = document.getElementById("root")!;
const placeholder = root.firstElementChild;

if (placeholder) {
    // Add fade-out animation
    placeholder.setAttribute('style', 'transition: opacity 0.3s ease-out; opacity: 1;');

    // Start fade after a tiny delay
    setTimeout(() => {
        placeholder.setAttribute('style', 'transition: opacity 0.3s ease-out; opacity: 0;');
    }, 100);
}

// Render React app (will replace placeholder after fade)
setTimeout(() => {
    createRoot(root).render(<App />);
}, 400);
