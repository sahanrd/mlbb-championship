/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060709',
          900: '#0b0e14',
          800: '#121722',
          700: '#1c2436',
        },
        cyber: {
          cyan: '#00F0FF',
          amber: '#FFB800',
          red: '#FF2E54',
          purple: '#8B5CF6',
          emerald: '#10B981',
          gold: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Rajdhani', 'sans-serif'],
        mlbb: ['Cinzel', 'serif'],
        gaming: ['Chakra Petch', 'Rajdhani', 'sans-serif'],
        esports: ['Teko', 'Bebas Neue', 'Rajdhani', 'sans-serif'],
        bebas: ['Bebas Neue', 'Teko', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(0, 240, 255, 0.3)',
        'glow-amber': '0 0 20px -5px rgba(255, 184, 0, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-purple': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
        'glow-red': '0 0 20px -5px rgba(255, 46, 84, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.9' }
        }
      }
    },
  },
  plugins: [],
}
