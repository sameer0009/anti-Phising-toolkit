import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                cyber: {
                    900: "#0f172a",
                    800: "#1e293b",
                    500: "#3b82f6",
                    400: "#60a5fa",
                    accent: "#06b6d4"
                }
            },
        },
    },
    plugins: [],
};
export default config;
