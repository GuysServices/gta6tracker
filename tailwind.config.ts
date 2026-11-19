import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vice City palette
        vc: {
          black:   '#080810',
          dark:    '#0d0d1a',
          panel:   '#12121f',
          border:  '#1e1e35',
          cyan:    '#00d4ff',
          pink:    '#ff2d78',
          gold:    '#ffc72c',
          purple:  '#7b2fff',
          muted:   '#4a4a6a',
          text:    '#c8c8e0',
          bright:  '#f0f0ff',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-vc': `linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid-vc': '40px 40px',
      },
    },
  },
  plugins: [],
}

export default config
