// const httpStatus = require("http-status");
// const ThrowError = require("../utils/ThrowError");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const { newsService, imageService } = require("../services");
const { normalizeSomeNewsData, normalizeNewsData } = require("../utils/helpers");

const createNews = catchAsync(async (req, res) => {
    const { isPublished } = req.body;
    const newsBody = pick(req.body, ["title", "content", "avatar", "pictures", "source", "category", "isPublished"]);
    let category = {};
    if (newsBody.category) category = newsService.getCategoryBySlug(newsBody.category);
    const news = await newsService.createNews({ ...newsBody, category }, isPublished);
    res.status(201).json(news);
});

const getSomeNews = catchAsync(async (req, res) => {
    const options = pick(req.query, ["page", "limit", "sortBy"]);
    const filters = pick(req.query, ["title", "isPublished"]);
    if (filters.title) {
        filters.$text = { $search: filters.title };
        delete filters.title;
    }
    const news = await newsService.queryNews(filters, options);
    if (filters.isPublished) {
        res.status(200).json(normalizeSomeNewsData(news));
    } else {
        res.status(200).json(news);
    }
});

const getNews = catchAsync(async (req, res) => {
    const { id: newsId } = req.params;
    const news = await newsService.getNewsById(newsId);
    res.status(200).json(normalizeNewsData(news));
});

const deleteNews = catchAsync(async (req, res) => {
    const { id: newsId } = req.params;
    const news = await newsService.getNewsById(newsId);
    const { avatar, pictures } = news;
    const newsPictures = [avatar, ...pictures];
    await Promise.all([newsService.deleteNews(news), imageService.deleteImages(newsPictures)]);
    res.status(204).end();
});

const updateNews = catchAsync(async (req, res) => {
    const { id: newsId } = req.params;
    const { category: categorySlug, isPublished } = req.body;
    const news = await newsService.getNewsById(newsId);
    const { avatar, pictures } = news;
    const unnecessaryPictures = [];
    const newsBody = pick(req.body, ["title", "content", "avatar", "pictures", "source", "isPublished"]);
    if (isPublished) {
        newsBody.category = newsService.getCategoryBySlug(categorySlug);
    }
    if (newsBody.avatar?.publicId !== avatar?.publicId) {
        unnecessaryPictures.push({ ...avatar });
    }
    newsBody?.pictures?.forEach((picture) => {
        if (pictures.some((p) => p.publicId === picture.publicId)) {
            unnecessaryPictures.push(picture);
        }
    });
    await Promise.all([
        newsService.updateNews(news, newsBody, isPublished),
        imageService.deleteImages(unnecessaryPictures),
    ]);
    res.status(200).json(normalizeNewsData(news));
});

module.exports = {
    createNews,
    getSomeNews,
    getNews,
    deleteNews,
    updateNews,
};
