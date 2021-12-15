const catchAsync = require("../utils/catchAsync");
const { configService, estateService, newsService } = require("../services");
const { beautifyPhoneNumber } = require("../utils/beautifyString");
const {
    normalizeEstateData,
    normalizeEstatesData,
    normalizeSomeNewsData,
    normalizeNewsData,
} = require("../utils/helpers");
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
    const news = await newsService.queryNews({}, { limit: 7 });
    res.renderConfigs = {
        path: "pages/home",
        data: {
            estates: normalizeEstatesData(estates),
            news: normalizeSomeNewsData(news),
        },
    };
    next();
});

const renderRealEstatesPage = catchAsync(async (req, res, next) => {
    const options = pick(req.query, ["page"]);
    const { query: searchQuery } = req.query;
    const filters = {};
    let title = "Danh sách bất động sản đang bán";
    const { category: categorySlug } = req.params;
    let category;
    if (categorySlug) {
        category = await estateService.getCategoryBySlug(categorySlug);
        title = `Danh sách bất động sản ${category.name}`;
        filters["category.slug"] = categorySlug;
    }
    if (searchQuery) {
        filters.$text = { $search: searchQuery };
        title = `Kết quả tìm kiếm cho từ khóa '${searchQuery}'`;
    }
    const estates = await estateService.queryEstates(filters, { ...options, limit: 18 });
    res.renderConfigs = {
        path: "pages/realEstatesList",
        data: {
            estates: normalizeEstatesData(estates),
            title,
            category: categorySlug
                ? {
                      name: category.name,
                      url: category.slug,
                  }
                : undefined,
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
    const options = pick(req.query, ["page"]);
    const { query: searchQuery } = req.query;
    const filters = {};
    let title = "Danh sách tin tức mới nhất";
    const { category: categorySlug } = req.params;
    let category;
    if (categorySlug) {
        category = await newsService.getCategoryBySlug(categorySlug);
        title = `Danh sách tin tức về ${category.name}`;
        filters["category.slug"] = categorySlug;
    }
    if (searchQuery) {
        filters.$text = { $search: searchQuery };
        title = `Kết quả tìm kiếm cho từ khóa '${searchQuery}'`;
    }
    const news = await newsService.queryNews(filters, { ...options, limit: 18, sortBy: "updatedAt:desc" });
    res.renderConfigs = {
        path: "pages/newsList",
        data: {
            news: normalizeSomeNewsData(news),
            title,
            category: categorySlug
                ? {
                      name: category.name,
                      url: category.slug,
                  }
                : undefined,
            query: searchQuery,
        },
    };
    next();
});

const renderNewsDetailPage = catchAsync(async (req, res, next) => {
    const { id: newsId } = req.params;
    const news = await newsService.getNewsById(newsId);
    const suggestionEstates = await estateService.getRandomEstates({}, { limit: 6 });
    const randomNews = await newsService.getRandomNews({}, { limit: 6 });
    res.renderConfigs = {
        path: "pages/newsDetail",
        data: {
            news: normalizeNewsData(news),
            suggestionEstates: normalizeEstatesData(suggestionEstates),
            randomNews: normalizeSomeNewsData(randomNews),
        },
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
