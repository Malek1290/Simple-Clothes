/* Optional: drop this into a Tailwind project to reuse the AUREL design system.
   The standalone index.html does not require Tailwind — its CSS is embedded. */

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#F4F1EA', soft: '#EFECE6', deep: '#E7E2D8', paper: '#FBF9F5' },
        ink: { DEFAULT: '#1A1A1A', soft: '#37332F' },
        muted: '#736D64',
        gold: { DEFAULT: '#A88B5B', soft: '#C6AF88', deep: '#876C41' },
        line: 'rgba(26,26,26,.15)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Bodoni MT', 'Didot', 'Times New Roman', 'serif'],
        sans: ['DM Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['10px', { lineHeight: '1.5', letterSpacing: '0.24em' }],
      },
      letterSpacing: {
        luxe: '0.24em',
        wide2: '0.2em',
      },
      maxWidth: {
        site: '1320px',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        pulse: {
          '0%': { transform: 'scale(.6)', opacity: '.9' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        cue: {
          '0%': { transform: 'translateX(-100%)' },
          '55%,100%': { transform: 'translateX(100%)' },
        },
        reveal: {
          from: { opacity: '0', transform: 'translateY(26px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        marquee: 'marquee 42s linear infinite',
        pulse: 'pulse 2.4s ease-out infinite',
        cue: 'cue 2.6s cubic-bezier(0.22,1,0.36,1) infinite',
        reveal: 'reveal .9s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
