const catchAsync = require("../utils/catchAsync");
const { configService, estateService } = require("../services");
const { beautifyPhoneNumber } = require("../utils/beautifyString");
const { normalizeEstateData, normalizeEstatesData } = require("../utils/helpers");
const pick = require("../utils/pick");

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
    const options = pick(req.query, ["page"]);
    const estates = await estateService.queryEstates({}, { ...options, limit: 18 });
    res.renderConfigs = {
        path: "pages/realEstatesList",
        data: {
            estates: normalizeEstatesData(estates),
        },
    };
    next();
});

const renderRealEstatePage = catchAsync(async (req, res, next) => {
    const estate = await estateService.getEstateById(req.params.id);
    const randomEstates = await estateService.getRandomEstates({}, { limit: 6 });
    const sameAreaEstates = await estateService.getRandomEstates(
        {
            $and: [
                { "location.district.districtId": estate.location.district.districtId },
                { _id: { $ne: estate._id } },
            ],
        },
        { limit: 6 }
    );
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
