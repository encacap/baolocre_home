const path = require("path");

module.exports = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        home: ["./src/resources/js/home.js"],
        real_estate_detail: ["./src/resources/js/realEstateDetail.js"],
        zalo: ["./src/resources/js/zalo.js"],
    },
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "src/assets/js"),
    },
    devtool: "source-map",
};
