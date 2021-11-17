const catchAsync = require("../utils/catchAsync");
const { configService } = require("../services");
const { beautifyPhoneNumber } = require("../utils/beautifyString");

const getContactInformation = async (req, res, next) => {
    const contactInformation = await configService.getConfigs([
        "youtube",
        "facebook",
        "zaloNumber",
        "phoneNumber",
        "address",
    ]);
    contactInformation.friendlyPhoneNumber = beautifyPhoneNumber(
        contactInformation.phoneNumber
    );
    const renderConfigs = { ...res.renderConfigs };
    renderConfigs.data = {
        ...renderConfigs.data,
        contactInformation,
    };
    res.renderConfigs = renderConfigs;
    next();
    return contactInformation;
};

const renderHomePage = catchAsync(async (req, res, next) => {
    res.renderConfigs = {
        path: "pages/home",
        data: {},
    };
    next();
});

const renderRealEstatesPage = catchAsync(async (req, res, next) => {
    res.renderConfigs = {
        path: "pages/realEstatesList",
        data: {},
    };
    next();
});

const renderRealEstatePage = catchAsync(async (req, res, next) => {
    res.renderConfigs = {
        path: "pages/realEstateDetail",
        data: {},
    };
    next();
});

const renderNewsPage = catchAsync(async (req, res, next) => {
    res.renderConfigs = {
        path: "pages/newsList",
        data: {},
    };
    next();
});

const renderNewsDetailPage = catchAsync(async (req, res, next) => {
    res.renderConfigs = {
        path: "pages/newsDetail",
        data: {},
    };
    next();
});

module.exports = {
    renderHomePage,
    renderRealEstatesPage,
    renderRealEstatePage,
    renderNewsPage,
    renderNewsDetailPage,
    getContactInformation,
};
