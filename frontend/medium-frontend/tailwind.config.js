/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "'node_modules/flowbite-react/lib/esm/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily:{
      body:["Bona Nova SC"],
      'source-serif': ['"Source Serif 4"'],
      },
      
      backgroundImage:{
        'hero-pattern': "url('../assets/texture.jpg')"
      },
      keyframes: {
        likeJump: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        },
      },
      animation: {
        likeJump: 'likeJump 0.3s ease',
      },
      boxShadow: {
        'custom': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -4px rgba(0, 0, 0, 0.1)' // Define your custom box shadow
      },
    },
  },
 
  plugins: [
   
]
}

