import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import config from './keystatic.config'; // Optional: ensures config builds with site
import markdoc from "@astrojs/markdoc";
import vercel from "@astrojs/vercel"; // Use standard import

export default defineConfig({
  site: 'https://www.nordamenterprises.com',

  integrations: [
    tailwind(),
    react(),
    keystatic(),
    markdoc(),
  ],

  output: 'server',
  
  // Update configuration to be explicit
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true, // Ensures images work correctly in server mode
  })
});