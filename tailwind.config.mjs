/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: "2.25rem",
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            h2: {
              fontSize: "1.875rem",
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            h3: {
              fontSize: "1.5rem",
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            h4: {
              fontSize: "1.25rem",
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            p: {
              color: "#1F2937",
              fontSize: "1rem",
              lineHeight: "1.75rem",
              margin: "0.5rem 0",
            },
            del: {
              color: "#1F2937",
              fontSize: "1rem",
              lineHeight: "1.75rem",
            },
            strong: {
              fontWeight: "700",
            },
            img: {
              width: "100%",
              borderRadius: "0.375rem",
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: "#3B82F6",
              paddingLeft: "1.25rem",
              margin: "1.25rem 0",
            },
            "blockquote p": {
              margin: "0.5rem 0",
            },
            code: {
              backgroundColor: "#BFDBFE",
              fontWeight: "700",
              padding: "0.25rem",
              borderRadius: "0.25rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            mark: {
              backgroundColor: "#BFDBFE",
              fontWeight: "700",
              padding: "0.25rem",
              borderRadius: "0.25rem",
            },
            a: {
              color: "#3B82F6",
              textDecoration: "underline",
            },
            aside: {
              backgroundColor: "#E5E7EB",
              padding: "1.25rem",
              fontSize: "1rem",
              lineHeight: "1.75rem",
            },
            "aside dd": {
              fontSize: "1rem",
              lineHeight: "1.75rem",
              color: "#9CA3AF",
            },
            "aside small": {
              display: "block",
              fontSize: "1rem",
              color: "#9CA3AF",
              textAlign: "right",
              marginTop: "0.625rem",
            },
            table: {
              borderRadius: "0.375rem",
              overflow: "hidden",
              borderCollapse: "collapse",
            },
            th: {
              backgroundColor: "#E5E7EB",
              padding: "0.625rem",
              fontSize: "1rem",
              lineHeight: "1.5rem",
              textAlign: "start",
              borderLeftWidth: "1px",
              borderLeftColor: "#FFFFFF",
            },
            tr: {
              borderBottomWidth: "1px",
              borderBottomColor: "#D1D5DB",
            },
            td: {
              padding: "0.625rem",
              fontSize: "1rem",
              lineHeight: "1.5rem",
            },
            pre: {
              padding: "0.875rem",
            },
            "ul > li": {
              margin: "1rem 0",
              marginLeft: "1rem",
            },
            "ol > li": {
              margin: "1rem 0",
              marginLeft: "1rem",
            },
            small: {
              display: "flex",
              width: "100%",
              justifyContent: "center",
              fontSize: "0.875rem",
              color: "#9CA3AF",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
