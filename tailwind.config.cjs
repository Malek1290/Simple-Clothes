/* Optional: drop this into a Tailwind project to reuse the Malek for Website
   design system. The standalone index.html does not require Tailwind — its
   CSS is embedded and self-contained. */

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#07090D', 2: '#0A0D13', panel: '#0D1118', raised: '#11161F' },
        ink: { DEFAULT: '#F3EEE2', soft: '#D9D3C5' },
        muted: { DEFAULT: '#9A968C', soft: '#8F8C84' },
        gold: { DEFAULT: '#D9B36B', light: '#F2DCAE', deep: '#A37F3E', cream: '#F7E7C0' },
        line: { DEFAULT: 'rgba(217,179,107,.16)', soft: 'rgba(243,238,226,.08)' },
      },
      fontFamily: {
        display: ['El Messiri', 'Cairo', 'Segoe UI', 'serif'],
        sans: ['Cairo', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Cormorant', 'Times New Roman', 'serif'],
      },
      letterSpacing: {
        luxe: '0.24em',
        wide2: '0.2em',
      },
      maxWidth: {
        site: '1240px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'gold-grad': 'linear-gradient(135deg, #F7E7C0 0%, #D9B36B 45%, #9A7433 100%)',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        pulse: {
          '0%': { transform: 'scale(.7)', opacity: '.8' },
          '70%,100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        riseIn: {
          from: { opacity: '0', transform: 'translateY(26px)', filter: 'blur(6px)' },
          to: { opacity: '1', transform: 'none', filter: 'none' },
        },
      },
      animation: {
        marquee: 'marquee 46s linear infinite',
        spin: 'spin 24s linear infinite',
        pulse: 'pulse 2.8s ease-out infinite',
        rise: 'riseIn .9s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
