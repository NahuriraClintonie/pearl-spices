// src/page/index.tsx
import ReactDOM from "react-dom/client";
import View from "./view";
import "../index.css"; // Tailwind or global CSS

const rootElement = document.getElementById("page");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<View />);
}
