import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "theme-w-react/bundled",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.tsx"),
      },
      output: {
        entryFileNames: "js/[name].js",
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.names && chunkInfo.names[0].endsWith(".css")) {
            return "css/[name][extname]";
          }
          return "js/[name][extname]";
        },
      },
    },
  },
});
