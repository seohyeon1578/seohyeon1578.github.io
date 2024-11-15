/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: '1.875rem',
              '@screen sm': {
                fontSize: '2.25rem',
              },
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            h2: {
              fontSize: '1.5rem',
              '@screen sm': {
                fontSize: '1.875rem',
              },
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            h3: {
              fontSize: '1.25rem',
              '@screen sm': {
                fontSize: '1.5rem',
              },
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            h4: {
              fontSize: '1.125rem',
              '@screen sm': {
                fontSize: '1.25rem',
              },
              fontWeight: "700",
              margin: "1.25rem 0",
            },
            p: {
              color: "#1F2937",
              fontSize: '0.9375rem',
              '@screen sm': {
                fontSize: '1rem',
              },
              lineHeight: "1.75rem",
              margin: "0.5rem 0",
            },
            img: {
              width: "100%",
              borderRadius: "0.375rem",
              margin: "1.5rem 0",
              '@screen sm': {
                margin: "2rem 0",
              },
            },
            pre: {
              padding: "1rem",
              '@screen sm': {
                padding: "1.5rem",
              },
              fontSize: '0.875rem',
              '@screen sm': {
                fontSize: '1rem',
              },
              borderRadius: "0.5rem",
              overflowX: "auto",
            },
            code: {
              backgroundColor: "#BFDBFE",
              fontSize: '0.875rem',
              '@screen sm': {
                fontSize: '1rem',
              },
              padding: "0.25rem",
              borderRadius: "0.25rem",
            },
            "ul > li": {
              margin: "0.75rem 0",
              '@screen sm': {
                margin: "1rem 0",
              },
              marginLeft: "1rem",
              fontSize: '0.9375rem',
              '@screen sm': {
                fontSize: '1rem',
              },
            },
            "ol > li": {
              margin: "0.75rem 0",
              '@screen sm': {
                margin: "1rem 0",
              },
              marginLeft: "1rem",
              fontSize: '0.9375rem',
              '@screen sm': {
                fontSize: '1rem',
              },
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: "#3B82F6",
              paddingLeft: "1rem",
              '@screen sm': {
                paddingLeft: "1.25rem",
              },
              margin: "1.25rem 0",
              fontSize: '0.9375rem',
              '@screen sm': {
                fontSize: '1rem',
              },
            },
            // 기존 스타일 유지
            del: {
              color: "#1F2937",
              fontSize: "1rem",
              lineHeight: "1.75rem",
            },
            strong: {
              fontWeight: "700",
            },
            "blockquote p": {
              margin: "0.5rem 0",
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
