const catchAsync = require("../utils/catchAsync");
const { configService, estateService } = require("../services");
const { beautifyPhoneNumber } = require("../utils/beautifyString");
const { normalizeEstateData, normalizeEstatesData } = require("../utils/helpers");

const getContactInformation = catchAsync(async (req, res, next) => {
    const contactInformation = await configService.getConfigs([
        "youtube",
        "facebook",
        "zaloNumber",
        "phoneNumber",
        "address",
    ]);
    contactInformation.friendlyPhoneNumber = beautifyPhoneNumber(contactInformation.phoneNumber);
    const renderConfigs = { ...res.renderConfigs };
    renderConfigs.data = {
        ...renderConfigs.data,
        contactInformation,
    };
    res.renderConfigs = renderConfigs;
    next();
    return contactInformation;
});

const renderHomePage = catchAsync(async (req, res, next) => {
    const estates = await estateService.queryEstates({}, { limit: 8 });
    res.renderConfigs = {
        path: "pages/home",
        data: {
            estates: normalizeEstatesData(estates),
        },
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
    const randomEstates = await estateService.queryEstates({}, { limit: 6 });
    const sameAreaEstates = await estateService.queryEstates({}, { limit: 3 });
    const estate = await estateService.getEstateById(req.params.id);
    res.renderConfigs = {
        path: "pages/realEstateDetail",
        data: {
            estate: normalizeEstateData(estate),
            randomEstates: normalizeEstatesData(randomEstates),
            sameAreaEstates: normalizeEstatesData(sameAreaEstates),
        },
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
