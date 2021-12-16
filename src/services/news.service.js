const httpStatus = require("http-status");
const ThrowError = require("../utils/ThrowError");
const { News } = require("../models");

const createNews = async (newsBody, validate = true) => {
    const news = new News(newsBody);
    return news.save({
        validateBeforeSave: validate,
    });
};

const queryNews = async (filters, options) => {
    const estates = await News.paginate(filters, options);
    return estates;
};

const getRandomNews = async (filters, options) => {
    const news = await News.aggregate([
        { $match: filters },
        {
            $sample: {
                size: options.limit,
            },
        },
    ]).exec();
    return { results: news, totalResults: news.length };
};

const getCategoryBySlug = (slug) => {
    const categories = {
        "thong-tin-quy-hoach": {
            name: "Thông tin quy hoạch",
            slug: "thong-tin-quy-hoach",
        },
        "phap-ly-bat-dong-san": {
            name: "Pháp lý Bất động sản",
            slug: "phap-ly-bat-dong-san",
        },
        "phan-tich-thi-truong": {
            name: "Phân tích thị trường",
            slug: "phan-tich-thi-truong",
        },
    };
    const category = categories[slug];
    if (!category) {
        throw new ThrowError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
};

const getNewsById = async (newsId) => {
    const news = await News.findById(newsId);
    if (!news) {
        throw new ThrowError(httpStatus.NOT_FOUND, "News not found");
    }
    return news;
};

const updateNews = async (news, newsBody, validate = true) => {
    Object.assign(news, newsBody);
    return news.save({
        validateBeforeSave: validate,
    });
};

const updateNewsById = async (newsId, newsBody) => {
    const news = await getNewsById(newsId);
    Object.assign(news, newsBody);
    return news.save();
};

const deleteNews = async (news) => {
    await news.remove();
    return news;
};

module.exports = {
    createNews,
    queryNews,
    getRandomNews,
    getCategoryBySlug,
    getNewsById,
    updateNews,
    updateNewsById,
    deleteNews,
};
