const catchAsync = require("../utils/catchAsync");

const renderHomePage = catchAsync((req, res) => {
    res.render("pages/home", {});
});

module.exports = {
    renderHomePage,
};
