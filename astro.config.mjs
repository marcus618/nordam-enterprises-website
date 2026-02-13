import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: 'https://www.nordamenterprises.com',

  integrations: [
    tailwind(),
    react(),
    keystatic(),
    markdoc(),
  ],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }  })
});