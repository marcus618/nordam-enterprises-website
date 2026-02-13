import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel";

// Debugging: Log environment state to Vercel Build Logs
console.log("--- NORDAM BUILD CONFIG ---");
console.log("VERCEL env var detected:", process.env.VERCEL);
console.log("Expected URL:", "https://www.nordamenterprises.com");
console.log("---------------------------");

// Determine if we are building on Vercel
const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  site: 'https://www.nordamenterprises.com',

  vite: {
    define: {
      // This forces the value into the code where Keystatic looks for it
      'process.env.KEYSTATIC_URL': JSON.stringify(process.env.KEYSTATIC_URL),
    },
  },

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