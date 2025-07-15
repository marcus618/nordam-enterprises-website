/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#01499b', // Tailwind usage only
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#01499b',
          'primary-focus': '#013f88',
          'primary-content': '#ffffff',
          // optionally inherit other parts of the theme
          'base-100': '#ffffff',
          'base-content': '#1f2937',
        },
      },
      'dark', // keep default dark theme
    ],
  },
}