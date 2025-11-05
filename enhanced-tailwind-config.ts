import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";

// Enhanced Tailwind CSS Configuration for 2025
// Features: Design tokens, container queries, modern animations, theme system
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      // Design Token System for Resume Templates
      colors: {
        // Core semantic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Enhanced primary system with semantic tokens
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
        },

        // Template-specific semantic tokens
        resume: {
          header: 'hsl(var(--resume-header))',
          'header-text': 'hsl(var(--resume-header-text))',
          section: 'hsl(var(--resume-section))',
          'section-text': 'hsl(var(--resume-section-text))',
          accent: 'hsl(var(--resume-accent))',
          'accent-light': 'hsl(var(--resume-accent-light))',
          border: 'hsl(var(--resume-border))',
          'skill-tag': 'hsl(var(--resume-skill-tag))',
          'skill-tag-text': 'hsl(var(--resume-skill-tag-text))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },

      // Enhanced typography scale with design tokens
      fontSize: {
        'resume-name': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'resume-title': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'resume-section': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }],
        'resume-body': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'resume-caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
      },

      // Container query breakpoints
      containers: {
        'resume': '210mm', // A4 width
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
      },

      // Enhanced spacing system
      spacing: {
        'resume-margin': 'var(--resume-margin)',
        'resume-padding': 'var(--resume-padding)',
        'section-gap': 'var(--section-gap)',
        'item-gap': 'var(--item-gap)',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'resume': 'var(--resume-border-radius)',
      },

      // Enhanced animation system for 2025
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--primary) / 0.7)' },
          '50%': { boxShadow: '0 0 0 8px hsl(var(--primary) / 0)' }
        }
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
      },

      // Grid systems for resume layouts
      gridTemplateColumns: {
        'resume-2col': '1fr 2fr',
        'resume-sidebar': '200px 1fr',
        'resume-modern': 'minmax(200px, 1fr) 3fr',
      },

      // Enhanced box shadows
      boxShadow: {
        'resume': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'resume-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'template-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'template-card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },

      // Print-specific styles
      screens: {
        'print': {'raw': 'print'},
        'xs': '475px',
      },
    }
  },
  plugins: [
    tailwindcssAnimate,
    typography,
    containerQueries,

    // Custom plugin for resume-specific utilities
    function({ addUtilities, addComponents, theme }) {
      addUtilities({
        '.resume-page': {
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        },
        '.resume-section': {
          marginBottom: theme('spacing.6'),
        },
        '.resume-item': {
          marginBottom: theme('spacing.4'),
        },
        '.print-hidden': {
          '@media print': {
            display: 'none',
          },
        },
        '.print-only': {
          display: 'none',
          '@media print': {
            display: 'block',
          },
        },
      });

      addComponents({
        '.btn-resume': {
          '@apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50': {},
          '@apply bg-primary text-primary-foreground hover:bg-primary/90': {},
          '@apply h-10 px-4 py-2': {},
        },
        '.skill-tag': {
          '@apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium': {},
          '@apply bg-resume-skill-tag text-resume-skill-tag-text': {},
          '@apply transition-colors hover:bg-resume-skill-tag/80': {},
        },
      });
    }
  ],
} satisfies Config;