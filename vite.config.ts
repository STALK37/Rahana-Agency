import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type PluginOption, type UserConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(async ({ command }): Promise<UserConfig> => {
  // Nitro turns the SSR build into a deployable server bundle. It is only
  // needed for `vite build`, so it stays out of the dev server entirely.
  const buildOnlyPlugins: PluginOption[] = [];
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    buildOnlyPlugins.push(nitro());
  }

  return {
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        // Route the bundled server entry through src/server.ts (SSR error wrapper).
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
      }),
      ...buildOnlyPlugins,
      viteReact(),
    ],
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": srcDir },
      // Keep a single copy of React and TanStack Query in the graph — duplicates
      // break hooks and the query cache during SSR.
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    server: {
      host: "::",
      port: 8080,
    },
  };
});
