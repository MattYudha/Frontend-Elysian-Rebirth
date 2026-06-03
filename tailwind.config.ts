import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            screens: {
                mobile: "375px",
                tablet: "768px",
                desktop: "1024px",
                "desktop-lg": "1200px",
                hd: "1820px",
                "blog-sm": "975px",
                "blog-md": "1000px",
                "blog-lg": "1280px",
                "blog-max": "1408px",
                "blog-xl": "1440px",
                "blog-2xl": "1584px",
                "landing-content": "944px",
                "landing-lg": "1296px",
                "landing-xs": "360px",
                "landing-sm": "720px",
                "landing-md": "960px",
                "landing-xl": "1440px",
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "cloud-float": "cloud-float 3s ease-in-out infinite",
                "cloud-float-slow": "cloud-float-slow 7s ease-in-out infinite",
                "sidebar-enter": "sidebar-enter 0.5s ease-out forwards",
                "logo-pulse": "logo-pulse 1.5s ease-out forwards",
                "marquee": "marquee 20s linear infinite",
                "line-shadow": "line-shadow 15s linear infinite",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "cloud-float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-6px)" },
                },
                "cloud-float-slow": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "sidebar-enter": {
                    from: { opacity: "0", transform: "translateY(-6px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "logo-pulse": {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "60%": { transform: "scale(1.05)", opacity: "1" },
                    "100%": { transform: "scale(1)" },
                },
                "marquee": {
                    "0%": { transform: "translate3d(0, 0, 0)" },
                    "100%": { transform: "translate3d(-50%, 0, 0)" },
                },
                "line-shadow": {
                    "0%": { "background-position": "0 0" },
                    "100%": { "background-position": "100% -100%" },
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography"),
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.pt-safe': {
                    paddingTop: 'env(safe-area-inset-top)',
                },
                '.pb-safe': {
                    paddingBottom: 'env(safe-area-inset-bottom)',
                },
                '.mt-safe': {
                    marginTop: 'env(safe-area-inset-top)',
                },
            })
        })
    ],
} satisfies Config

export default config
