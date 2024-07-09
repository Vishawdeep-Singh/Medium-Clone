/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
      body:["Bona Nova SC"]
      },
      backgroundImage:{
        'hero-pattern': "url('../assets/texture.jpg')"
      }
    },
  },
  plugins: [],
}

