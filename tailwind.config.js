// eslint-disable-next-line import/no-extraneous-dependencies
const lineClampPlugin = require("@tailwindcss/line-clamp");

module.exports = {
    purge: ["./src/**/*.ejs", "./src/resources/**/*.js"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                encacap: {
                    blue: {
                        light: "#8ECAE6",
                        DEFAULT: "#219EBC",
                        dark: "#023047",
                    },
                    main: "#FB8500",
                    yellow: "#FFB703",
                    facebook: "#1877f2",
                    zalo: "#03a5fa",
                },
            },
        },
    },
    variants: {
        extend: {
            ring: ["responsive", "hover", "focus", "active"],
        },
    },
    plugins: [lineClampPlugin],
};
