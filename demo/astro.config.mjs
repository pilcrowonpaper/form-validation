import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/edge";

// https://astro.build/config
export default defineConfig({
    integrations: [svelte(), tailwind()],
    output: "server",
    adapter: vercel(),
});
