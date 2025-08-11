import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [sveltekit(),tailwindcss(),],
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/lib/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {},
  },
});
