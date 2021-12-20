const catchAsync = require("../utils/catchAsync");
const { configService, estateService, newsService } = require("../services");
const { beautifyPhoneNumber } = require("../utils/beautifyString");
const {
    normalizeEstateData,
    normalizeEstatesData,
    normalizeSomeNewsData,
    normalizeNewsData,
} = require("../utils/helpers");
const { generateImageUrl } = require("../utils/cloudinary");
const pick = require("../utils/pick");

const getContactInformation = catchAsync(async (req, res, next) => {
    let contactInformation = await configService.getConfigs(["youtube", "facebook", "zalo", "phone", "address"]);
    contactInformation = contactInformation.reduce((information, config) => {
        // eslint-disable-next-line no-param-reassign
        information[config.name] = config.value;
        return information;
    }, {});
    contactInformation.friendlyPhoneNumber = beautifyPhoneNumber(contactInformation.phone);
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
    const [estates, news, sliderConfig] = await Promise.all([
        estateService.queryEstates({}, { limit: 8 }),
        newsService.queryNews({ isPublished: true }, { limit: 7 }),
        configService.getConfigs(["slider"]),
    ]);
    let slider = sliderConfig;
    slider = JSON.parse(slider[0].value);
    slider = slider.map((item) => ({
        ...item,
        url: generateImageUrl(item),
    }));
    res.renderConfigs = {
        path: "pages/home",
        data: {
            estates: normalizeEstatesData(estates),
            news: normalizeSomeNewsData(news),
            slider,
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
            searchQuery,
        },
    };
    next();
});

const renderRealEstatePage = catchAsync(async (req, res, next) => {
    const estate = await estateService.getEstateById(req.params.id);
    const [randomEstates, sameAreaEstates, news] = await Promise.all([
        estateService.getRandomEstates({}, { limit: 6 }),
        estateService.getRandomEstates(
            {
                $and: [
                    { "location.district.districtId": estate.location.district.districtId },
                    { _id: { $ne: estate._id } },
                ],
            },
            { limit: 6 }
        ),
        newsService.getRandomNews({ isPublished: true }, { limit: 20 }),
    ]);
    res.renderConfigs = {
        path: "pages/realEstateDetail",
        data: {
            estate: normalizeEstateData(estate),
            randomEstates: normalizeEstatesData(randomEstates),
            sameAreaEstates: normalizeEstatesData(sameAreaEstates),
            news: normalizeSomeNewsData(news),
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
    const news = await newsService.queryNews(
        { ...filters, isPublished: true },
        { ...options, limit: 18, sortBy: "updatedAt:desc" }
    );
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
    const [news, suggestionEstates, randomNews] = await Promise.all([
        newsService.getNewsById(newsId),
        estateService.getRandomEstates({}, { limit: 6 }),
        newsService.getRandomNews({ isPublished: true }, { limit: 20 }),
    ]);
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
