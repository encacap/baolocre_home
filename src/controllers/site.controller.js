const catchAsync = require("../utils/catchAsync");

const renderHomePage = catchAsync((req, res, next) => {
    res.renderConfigs = {
        path: "pages/home",
    };
    next();
});

const renderRealEstatesPage = catchAsync((req, res, next) => {
    res.renderConfigs = {
        path: "pages/realEstatesList",
    };
    next();
});

const renderRealEstatePage = catchAsync((req, res, next) => {
    res.renderConfigs = {
        path: "pages/realEstateDetail",
    };
    next();
});

const renderNewsPage = catchAsync((req, res, next) => {
    res.renderConfigs = {
        path: "pages/newsList",
    };
    next();
});

const renderNewsDetailPage = catchAsync((req, res, next) => {
    res.renderConfigs = {
        path: "pages/newsDetail",
    };
    next();
});

module.exports = {
    renderHomePage,
    renderRealEstatesPage,
    renderRealEstatePage,
    renderNewsPage,
    renderNewsDetailPage,
};
