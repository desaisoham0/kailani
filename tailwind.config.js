/** @type {import('tailwindcss').Config} */
import { fontConfig } from './src/styles/fontConfig.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: fontConfig,
      colors: {
        'kailani-purple': '#655D8A',
        'kailani-pink': '#D6B0B1',
      },
    },
  },
  plugins: [],
}