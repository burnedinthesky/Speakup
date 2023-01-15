/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#EAF5F6",
                    100: "#D2EBEE",
                    200: "#B5E0E5",
                    300: "#8ACDD6",
                    400: "#6DC1CB",
                    500: "#15A9BC",
                    600: "#0D91A0",
                    700: "#127A87",
                    800: "#125A63",
                    900: "#13474E",
                },
                neutral: {
                    50: "#F5FBFC",
                    100: "#EEF6F6",
                    200: "#E2EFF0",
                    300: "#CBDFE1",
                    400: "#94B4B8",
                    500: "#64878B",
                    600: "#4F777B",
                    700: "#406165",
                    800: "#2C4346",
                    900: "#243436",
                },
            },
            transitionProperty: {
                height: "height",
                width: "width",
            },
        },
    },
    plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar"), require("@tailwindcss/line-clamp")],
};
