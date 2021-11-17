const { minify } = require("html-minifier");
const httpStatus = require("http-status");

const ThrowError = require("../utils/ThrowError");

module.exports = (req, res, next) => {
    if (!res.renderConfigs) {
        next(
            new ThrowError(httpStatus.NOT_FOUND, "renderConfigs is not defined")
        );
        return;
    }
    const { path, data } = res.renderConfigs;
    if (!path) {
        next(new ThrowError(httpStatus.NOT_FOUND, "path is not defined"));
        return;
    }
    res.render(path, data, (error, html) => {
        if (error) {
            next(error);
            return;
        }
        res.send(
            minify(html, {
                removeAttributeQuotes: true,
                html5: true,
                removeComments: true,
                removeEmptyAttributes: true,
                collapseWhitespace: true,
                keepClosingSlash: true,
                minifyCSS: true,
            })
        );
    });
};
