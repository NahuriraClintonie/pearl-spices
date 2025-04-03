import { createRoot } from "react-dom/client";
import SingleRestaurantView from "./view";
import "../index.css";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("single-restaurants");
  if (container) {
    const root = createRoot(container);
    root.render(<SingleRestaurantView />);
  }
});
